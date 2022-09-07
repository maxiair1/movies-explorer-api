const { Joi, celebrate } = require('celebrate');

const urlRegexp = /https?:\/\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+\.[a-zA-Z0-9]{2,6}[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*/;
const ru = /^[?!,.а-яА-ЯёЁ0-9-_\s]+$/;
const en = /^[?!,.a-z0-9-_\s]+$/i;

const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const updateUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }),
});

const createMovieValidation = celebrate({
  body: Joi.object().keys({
    owner: Joi.string().hex().length(24),
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(urlRegexp).required(),
    trailerLink: Joi.string().pattern(urlRegexp).required(),
    nameRU: Joi.string().pattern(ru).required(),
    nameEN: Joi.string().pattern(en).required(),
    thumbnail: Joi.string().pattern(urlRegexp).required(),
    movieId: Joi.string().required(),
  }),
});

const movieIdValidation = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24),
  }),
});

module.exports = {
  createUserValidation,
  loginValidation,
  updateUserValidation,
  createMovieValidation,
  movieIdValidation,
  urlRegexp,
};
