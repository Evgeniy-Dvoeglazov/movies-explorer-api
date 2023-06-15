require('dotenv').config();
const http2 = require('node:http2');
const bcrypt = require('bcryptjs'); // Для хеширования пароля
const jwt = require('jsonwebtoken'); // Для создания токенов
const User = require('../models/user');

// Подключаем кастомный класс ошибок
const ConflictError = require('../errors/conflict-error');

const { NODE_ENV, JWT_SECRET } = process.env;
const { HTTP_STATUS_CREATED } = http2.constants;

// Возвращает информацию о пользователе
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

// Обновляет информацию о пользователе
module.exports.changeProfileInfo = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

// Создает пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  // хешируем пароль
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash, // записываем хеш в базу
    }))
    .then((user) => User.findById(user._id))
    .then((user) => res.status(HTTP_STATUS_CREATED).send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

// Авторизация пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      // Создаем токен
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 3600000 * 24 * 7,
        sameSite: true,
      }).send({ token });
    })
    .catch(next);
};

// Удаление токена из куков
module.exports.logout = (req, res, next) => {
  User.findById(req.user._id)
    .then(() => res.clearCookie('token').send({ message: 'jwt удален' }))
    .catch(next);
};
