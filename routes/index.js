const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const routesUser = require('./users');
const routesMovie = require('./movies');
const auth = require('../middlewares/auth');

const { createUser, login } = require('../controllers/users');

const validateUserSignup = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
});

const validateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

router.post('/signin', validateSignin, login);
router.post('/signup', validateUserSignup, createUser);
router.use(auth);
router.use('/', routesUser);
router.use('/', routesMovie);

module.exports = router;
