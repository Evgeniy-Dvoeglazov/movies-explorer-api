require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('./middlewares/cors');
const customError = require('./middlewares/customError');
const defaultError = require('./middlewares/defaultError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const DB_URL = require('./utils/utils');

// Применяем промежуточное ПО ограничения скорости ко всем запросам.
// Для защиты от DoS-атак.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // Ограничение каждого IP до 100 запросов `window` (here, per 15 minutes)
  standardHeaders: true, // Возвращаем информацию об ограничении скорости в заголовках `RateLimit-*`
  legacyHeaders: false, // Отключаем заголовки `X-RateLimit-*`
});

const { PORT = 3000 } = process.env;
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
