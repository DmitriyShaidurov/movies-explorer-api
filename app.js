require('dotenv').config();
const express = require('express');
const path = require('node:path');
const cors = require('cors');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/notFoundErr');
const router = require('./routes/index');

const app = express();

app.use(express.json());

app.use(cors());

app.use(express.json());

const allowedCors = [
  'http://localhost:3000',
  'https://localhost:3000',
  'localhost:3000',
  'localhost:3000',
  'http://localhost:3001',
  'https://localhost:3001',
  'localhost:3001',
  'localhost:3001',
  'https://api.dmitriysh.nomoredomains.club/',
  'http://api.dmitriysh.nomoredomains.club/',
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

app.use(cookieParser());
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use(router);//
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
