const router = require('express').Router();
const { createMovieValidation, movieIdValidation } = require('../validation/movieValidation');
const {
  getUserMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getUserMovies);

router.post('/', createMovieValidation, createMovie);

router.delete('/:movieId', movieIdValidation, deleteMovie);

module.exports = router;
