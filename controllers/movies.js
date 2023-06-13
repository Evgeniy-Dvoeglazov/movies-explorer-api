const Movie = require('../models/movie');

module.exports.getUserMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (movie === null) {
        throw new NotFoundError('Карточка не найдена');
      } else if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нет доступа');
      } else {
        Movie.findByIdAndRemove(req.params.movieId)
          .then(() => res.send({ message: 'Карточка удалена' }))
          .catch(next);
      }
    })
    .catch(next);
};
