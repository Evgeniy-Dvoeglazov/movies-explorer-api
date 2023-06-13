const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    required: true,
    type: String,
  },
  director: {
    required: true,
    type: String,
  },
  duration: {
    required: true,
    type: Number,
  },
  year: {
    required: true,
    type: String,
  },
  description: {
    required: true,
    type: String,
  },
  image: {
    required: true,
    type: String,
    validate: {
      validator: (v) => /https?:\/\/(\d{3}\.)?[a-zA-Z0-9\-._~:?#[\]@!$&'()*+,;=]+#?\.[a-zA-Z]{2,3}(\/\S*)?/.test(v),
      message: 'Неправильно указана ссылка',
    },
  },
  trailerLink: {
    required: true,
    type: String,
    validate: {
      validator: (v) => /https?:\/\/(\d{3}\.)?[a-zA-Z0-9\-._~:?#[\]@!$&'()*+,;=]+#?\.[a-zA-Z]{2,3}(\/\S*)?/.test(v),
      message: 'Неправильно указана ссылка',
    },
  },
  thumbnail: {
    required: true,
    type: String,
    validate: {
      validator: (v) => /https?:\/\/(\d{3}\.)?[a-zA-Z0-9\-._~:?#[\]@!$&'()*+,;=]+#?\.[a-zA-Z]{2,3}(\/\S*)?/.test(v),
      message: 'Неправильно указана ссылка',
    },
  },
  owner: {
    ref: 'user',
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
  movieId: {
    required: true,
    type: Number,
  },
  nameRU: {
    required: true,
    type: String,
  },
  nameEN: {
    required: true,
    type: String,
  },
}, { versionKey: false });

module.exports = mongoose.model('movie', movieSchema);
