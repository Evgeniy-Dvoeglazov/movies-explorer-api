const router = require('express').Router();
const auth = require('../middlewares/auth');
const { createUser, login, logout } = require('../controllers/users');
const { createUserValidation, loginValidation } = require('../validation/userValidation');
const NotFoundError = require('../errors/not-found-error');

router.post('/signin', loginValidation, login);
router.post('/signup', createUserValidation, createUser);

router.use(auth);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.post('/signout', logout);

router.use(() => { // Выводим ошибку при неверных роутах
  throw new NotFoundError('Запрашиваемая информация не найдена');
});

module.exports = router;
