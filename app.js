require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const { limiter } = require('./middlewares/limiter');
const { createUser } = require('./controllers/users');
const { login } = require('./controllers/login');
const { auth } = require('./middlewares/auth');
const { loginValidation, createUserValidation } = require('./middlewares/joiValidation');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { DB_PATH, PORT, corsOptions } = require('./utils/devConst');

const app = express();

mongoose.connect(DB_PATH)
  .then(() => console.log('filmDB connected'))
  .catch((err) => console.log(`cant connect to filmDB: ${err.message}`));

app.use('*', cors(corsOptions));
app.use(helmet());
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);
app.post('/signup', createUserValidation, createUser);
app.post('/signin', loginValidation, login);

app.use('/users', auth, userRouter);
app.use('/movies', auth, movieRouter);

app.use(errorLogger);
app.use((err, req, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message, err });
  }
  res.status(500).send('что-то пошло не так');
  return next();
});

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
