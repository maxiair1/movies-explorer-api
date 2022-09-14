const router = require('express').Router();
const { getUserById, updateUser } = require('../controllers/users');
const { updateUserValidation } = require('../middlewares/joiValidation');
const { auth } = require('../middlewares/auth');

router.get('/me', auth, getUserById);
router.patch('/me', auth, updateUserValidation, updateUser);

module.exports = router;
