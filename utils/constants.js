const http2 = require('node:http2');

const allowedCors = [
  'http://movies.dvoeglazov.nomoredomains.rocks',
  'https://movies.dvoeglazov.nomoredomains.rocks',
  'https://localhost:3000',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://localhost:3001',
];

const {
  HTTP_STATUS_BAD_REQUEST, // 400
  HTTP_STATUS_UNAUTHORIZED, // 401
  HTTP_STATUS_CONFLICT, // 409
  HTTP_STATUS_FORBIDDEN, // 403
  HTTP_STATUS_NOT_FOUND, // 404
  HTTP_STATUS_INTERNAL_SERVER_ERROR, // 500
} = http2.constants;

module.exports = {
  allowedCors,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_UNAUTHORIZED,
  HTTP_STATUS_CONFLICT,
  HTTP_STATUS_FORBIDDEN,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
};
