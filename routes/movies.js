const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMovie, createMovie, deleteMovie,
} = require('../controllers/movies');

const validationMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/).required(),
    trailerLink: Joi.string().pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/).required(),
    thumbnail: Joi.string().pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

router.get('/movies', getMovie);

router.post('/movies', validationMovie, createMovie);

router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().pattern(/[a-f0-9]{24,24}/)
      .length(24),
  }),
}), deleteMovie);

module.exports = router;
