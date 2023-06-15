const router = require('express').Router();
const { profileValidation } = require('../validation/userValidation');
const {
  getCurrentUser,
  changeProfileInfo,
} = require('../controllers/users');

router.get('/me', getCurrentUser);

router.patch('/me', profileValidation, changeProfileInfo);

module.exports = router;
