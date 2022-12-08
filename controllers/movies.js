const mongoose = require('mongoose');
const BadRequestError = require('../errors/badRequestErr');
const NotFoundError = require('../errors/notFoundErr');
const NoAccessErr = require('../errors/noAccessErr');
const Movie = require('../models/movie');

const getMovie = async (req, res, next) => {
  try {
    const movies = await Movie.find({});
    return res.send(movies);
  } catch (err) {
    return next(err);
  }
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const owner = req.user._id;
  Movie.findById(movieId)
    .orFail(new NotFoundError('Видео с указанным _id не найдено.'))
    .then((movie) => {
      if (movie.owner.toString() === owner.toString()) {
        return movie.remove()
          .then(() => res.status(200).send({ message: 'Фильм удалён' }));
      }
      throw new NoAccessErr('Нет прав на удаление видео');
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Переданы неккоректные данные'));
      }
      return next(err);
    });
};

const createMovie = (req, res, next) => {
  const ownerId = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: ownerId,
  })
    .then((movie) => {
      res.status(200).send(movie);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании видео.'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovie,
  createMovie,
  deleteMovie,
};
