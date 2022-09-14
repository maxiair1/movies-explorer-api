require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');

const { limiter } = require('./middlewares/limiter');
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
app.use(require('./routes/index'));

// app.use(require('./routes/users'));
// app.use(require('./routes/movies'));

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  res.status(500).send('что-то пошло не так');
  return next();
});

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
