const Movie = require('../models/movie');

// Подключаем кастомные классы ошибок
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const ConflictError = require('../errors/conflict-error');

// Получаем все сохраненные пользователем фильмы
module.exports.getUserMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

// Создаем фильм в категории "сохраненные"
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
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Фильм уже сохранен'));
      } else {
        next(err);
      }
    });
};

// Удаляем фильм из сохраненных
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (movie === null) {
        throw new NotFoundError('Фильм не найден');
      } else if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нет доступа');
      } else {
        Movie.findByIdAndRemove(req.params.movieId)
          .then(() => res.send({ message: 'Фильм удален' }))
          .catch(next);
      }
    })
    .catch(next);
};
