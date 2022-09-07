const bcrypt = require('bcryptjs');
const User = require('../models/user');
const RequestNotCorrectError = require('../errors/RequestNotCorrectError');
const NotFoundError = require('../errors/NotFoundError');
const ServerError = require('../errors/ServerError');
const ExistItemError = require('../errors/ExistItemError');
const { ERROR_MONGO_DUPLICATE_CODE } = require('../errors/errorCode');
const { saltRounds } = require('../utils/devConst');

module.exports.getUserById = (req, res, next) => {
  /*
   *  возвращает name, email пользователя
   *  req.user берем из auth -> req.user = checkToken(token);
   */
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Передан несуществующий _id пользователя.');
    })
    .then((user) => res.send({ name: user.name, email: user.email }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestNotCorrectError('Переданы некорректные данные'));
      } else if (err.name === 'NotFoundError') {
        next(err);
      } else {
        next(new ServerError('Ошибка по умолчанию.'));
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  /*
   *  обновляет поля name, email
   *  req.user берем из auth -> req.user = checkToken(token);
   *  передаем json запрос вида:
   *  {
   *   "name": "test1",
   *   "email": "test1@ya.ru"
   *  }
   */
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Передан несуществующий _id карточки.');
    })
    .then((user) => res.send({ userUpdate: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new RequestNotCorrectError('Переданы некорректные данные при обновлении профиля.'));
      } else if (err.name === 'NotFoundError') {
        next(err);
      } else {
        next(new ServerError('Ошибка по умолчанию.'));
      }
    });
};

module.exports.createUser = (req, res, next) => {
  /*
  * создает пользователя и возвращает имя, email и хэш пароля
  * {
  *   "name": "test1",
  *   "email": "test1@ya.ru",
  *   "password": "123"
  * }
  * */
  const { name, email, password } = req.body;
  if (!email || !password) {
    throw new RequestNotCorrectError('Переданы некорректные данные при создании пользователя.');
  }
  bcrypt
    .hash(password, saltRounds)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      res.send({ name: user.name, email: user.email });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestNotCorrectError('Переданы некорректные данные при создании пользователя.'));
      } else if (err.code === ERROR_MONGO_DUPLICATE_CODE) {
        next(new ExistItemError('При регистрации указан email, который уже существует на сервере'));
      } else if (err.name === 'RequestNotCorrectError') {
        next(err);
      } else {
        next(new ServerError('Ошибка по умолчанию.'));
      }
    });
};
