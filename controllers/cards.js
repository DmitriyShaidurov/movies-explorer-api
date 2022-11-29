const mongoose = require('mongoose');
const BadRequestError = require('../errors/badRequestErr');
const NotFoundError = require('../errors/notFoundErr');
const NoAccessErr = require('../errors/noAccessErr');
const Card = require('../models/card');

const getCard = async (req, res, next) => {
  try {
    const card = await Card.find({});
    return res.send(card);
  } catch (err) {
    return next(err);
  }
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user._id;
  Card.findById(cardId).orFail(new NotFoundError('Карточка с указанным _id не найдена.'))
    .then((card) => {
      if (!(card.owner._id.toString() === owner)) {
        throw new NoAccessErr('Нет прав на удаление карточки');
      }
      Card.findByIdAndRemove(cardId)
        .then((cardDel) => {
          if (cardDel) {
            res.status(200).send(cardDel);
          } else {
            throw NotFoundError('Карточка с указанным _id не найдена.');
          }
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Переданы неккоректные данные'));
      }
      return next(err);
    });
};

const createCard = (req, res, next) => {
  const ownerId = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner: ownerId })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res.status(200).send(card);
      }
      throw new NotFoundError('Карточка с указанным _id не найдена.');
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res.status(200).send(card);
      }
      throw new NotFoundError('Карточка с указанным _id не найдена');
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные для удаления лайка'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCard,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
