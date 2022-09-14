const jwt = require('jsonwebtoken');

const { SECRET_KEY, EXPIRE_TOKEN } = require('../utils/devConst');

const generateToken = (payload) => jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRE_TOKEN });

const checkToken = (token) => jwt.verify(token, SECRET_KEY);

module.exports = {
  generateToken,
  checkToken,
};
