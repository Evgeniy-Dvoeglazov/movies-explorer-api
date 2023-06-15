require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const limiter = require('./middlewares/rateLimiter');
const cors = require('./middlewares/cors');
const customError = require('./middlewares/customError');
const defaultError = require('./middlewares/defaultError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet()); // Для защиты от некоторых веб-уязвимостей
app.use(limiter);

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  family: 4,
});

app.use(requestLogger); // подключаем логгер запросов

app.use(cors);

app.use(cookieParser()); // подключаем парсер кук

app.use('/', require('./routes/index'));

app.use(errorLogger); // подключаем логгер ошибок

// Если запрос не проходит описанную валидацию Joi,
// celebrate передаст его дальше в обработчик ошибки.
app.use(errors()); // обработчик ошибок celebrate.
// Централизованный обработчик ошибок.
app.use(customError);
app.use(defaultError);

app.listen(PORT);
