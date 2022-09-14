const bcrypt = require('bcryptjs');
const User = require('../models/user');
const RequestDataError = require('../errors/RequestDataError');
const { generateToken } = require('../helpers/jwt');
const ExistItemError = require('../errors/ExistItemError');
const RequestNotCorrectError = require('../errors/RequestNotCorrectError');
const { ERROR_MONGO_DUPLICATE_CODE } = require('../errors/errorCode');
const { saltRounds } = require('../utils/devConst');

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
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new RequestDataError('передан неверный логин или пароль1.'));
      }
      return Promise.all([
        user,
        bcrypt.compare(password, user.password),
      ]);
    })
    .then(([user, matched]) => {
      if (!matched) {
        return Promise.reject(new RequestDataError('передан неверный логин или пароль2.'));
      }
      return generateToken({ _id: user._id });
    })
    .then((token) => {
      res.send({ token });
    })
    .catch((err) => next(err));
};
