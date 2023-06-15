const rateLimit = require('express-rate-limit');

// Применяем промежуточное ПО ограничения скорости ко всем запросам.
// Для защиты от DoS-атак.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // Ограничение каждого IP до 100 запросов `window` (here, per 15 minutes)
  standardHeaders: true, // Возвращаем информацию об ограничении скорости в заголовках `RateLimit-*`
  legacyHeaders: false, // Отключаем заголовки `X-RateLimit-*`
});

module.exports = limiter;
