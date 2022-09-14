const Movie = require('../models/movie');
const RequestNotCorrectError = require('../errors/RequestNotCorrectError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenActionError = require('../errors/ForbiddenActionError');

module.exports.createMovie = (req, res, next) => {
  /*
  *  необходимо передать _id пользователя в поле owner.
  *  req.user берем из auth -> req.user = checkToken(token);
  *
  * */
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    owner: req.user._id,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  })
    .then((movie) => res.send({ movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestNotCorrectError('Переданы некорректные данные при создании фильма 1.'));
      }
      next(err);
    });
};

module.exports.getMovies = (req, res, next) => {
  /*
   *  req.user берем из auth -> req.user = checkToken(token);
   *  вернет все фильмы, массив объектов
  */
  Movie.find({ owner: req.user._id.toString() })
    .then((movies) => res.send(movies))
    .catch((err) => {
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  /*
  * удаляет сохранённый фильм по id передаваемый в параметрах
  *  req.user берем из auth -> req.user = checkToken(token);
  *
  * */
  Movie.findOne({ _id: req.params._id })
    .orFail(() => {
      throw new NotFoundError('Передан не существующий id фильма.');
    })
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenActionError('попытка удалить чужой фильм');
      }
      return movie.remove();
    })
    .then((deletedMovie) => {
      res.send(deletedMovie);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestNotCorrectError('Переданы некорректные данные для удаления фильма 2.'));
      } else {
        next(err);
      }
    });
};
