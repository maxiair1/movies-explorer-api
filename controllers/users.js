const User = require('../models/user');
const RequestNotCorrectError = require('../errors/RequestNotCorrectError');
const NotFoundError = require('../errors/NotFoundError');
const ExistItemError = require('../errors/ExistItemError');
const { ERROR_MONGO_DUPLICATE_CODE } = require('../errors/errorCode');

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
    .catch((err) => next(err));
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
      throw new NotFoundError('Передан несуществующий _id пользователя.');
    })
    .then((user) => res.send({ userUpdate: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new RequestNotCorrectError('Переданы некорректные данные при обновлении профиля.'));
      } else if (err.code === ERROR_MONGO_DUPLICATE_CODE) {
        next(new ExistItemError('Данный email уже существует на сервере'));
      } else {
        next(err);
      }
    });
};
