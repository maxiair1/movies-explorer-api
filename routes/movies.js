const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { createMovieValidation, movieIdValidation } = require('../middlewares/joiValidation');
const { auth } = require('../middlewares/auth');

router.get('/', auth, getMovies);
router.post('/', auth, createMovieValidation, createMovie);
router.delete('/:_id', auth, movieIdValidation, deleteMovie);

module.exports = router;
