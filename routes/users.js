const router = require('express').Router();
const { getUserById, updateUser } = require('../controllers/users');
const { updateUserValidation } = require('../middlewares/joiValidation');

router.get('/me', getUserById);
router.patch('/me', updateUserValidation, updateUser);

module.exports = router;
