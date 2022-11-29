require('dotenv').config();
const express = require('express');
const path = require('node:path');
const { celebrate, Joi } = require('celebrate');
const cors = require('cors');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routesUser = require('./routes/users');
const routesCard = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/notFoundErr');

const app = express();

app.use(express.json());

app.use(cors());

app.use(express.json());

const allowedCors = [
  'http://dmitriy47.students.nomoredomains.icu:3000/',
  'https://dmitriy47.students.nomoredomains.icu:3000/',
  'http://dmitriy47.students.nomoredomains.icu:3001/',
  'https://dmitriy47.students.nomoredomains.icu:3001/',
  'http://158.160.41.215:3001',
  'http://158.160.41.215:3000',
  'https://158.160.41.215:3001',
  'https://158.160.41.215:3000',
  'http://localhost:3000',
  'https://localhost:3000',
  'localhost:3000',
  'localhost:3000',
  'http://localhost:3001',
  'https://localhost:3001',
  'localhost:3001',
  'localhost:3001',
];

app.use((req, res, next) => {
  const { origin } = req.headers;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
});

const { PORT = 3001, MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
});

const validateUserSignup = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(
      /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/,
    ),
  }),
});
const validateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

app.use(cookieParser());
app.use(requestLogger);
//
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
//
app.post('/signin', validateSignin, login);
app.post('/signup', validateUserSignup, createUser);
app.use(auth);

app.use('/', routesUser);
app.use('/', routesCard);
app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger);
app.use(express.static(path.join(__dirname, 'public')));
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
