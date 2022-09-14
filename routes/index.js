const router = require('express').Router();
const { createUser, login } = require('../controllers/login');
const { loginValidation, createUserValidation } = require('../middlewares/joiValidation');
const { auth } = require('../middlewares/auth');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signup', createUserValidation, createUser);
router.post('/signin', loginValidation, login);

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

router.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Страница не найдена.'));
});

module.exports = router;
