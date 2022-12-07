const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundErr');
const BadRequestError = require('../errors/badRequestErr');

const AlreadyRegisterError = require('../errors/alreadyRegisterErr');

const getUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId).orFail(new NotFoundError('User с указанным _id не найден'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name,
      email,
      password: hash,
    })
      .then((user) => res.status(200).send({
        _id: user._id,
        name: user.name,
        email: user.email,
      }))
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          next(new BadRequestError('Ошибка валидации'));
        } else if (err.code === 11000) {
          next(new AlreadyRegisterError('Пользователь уже зарегистрирован'));
        } else {
          next(err);
        }
      });
  });
};
const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, { name: req.body.name, email: req.body.email }, { new: true, runValidators: true }).orFail(new NotFoundError('Пользователь с указанным _id не найден.'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id, email: user.email }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {
        expiresIn: '7d',
      });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .status(200)
        .send({ token });
    })
    .catch(next);
};

module.exports = {
  createUser,
  updateUser,
  login,
  getUser,
};
