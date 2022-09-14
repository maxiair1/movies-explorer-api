const router = require('express').Router();
const { createUser, login } = require('../controllers/login');
const { loginValidation, createUserValidation } = require('../middlewares/joiValidation');

router.post('/signup', createUserValidation, createUser);
router.post('/signin', loginValidation, login);

module.exports = router;
