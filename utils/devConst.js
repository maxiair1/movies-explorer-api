const {
  NODE_ENV, JWT_SECRET, MONGO_PATH, EXPRESS_PORT,
} = process.env;

module.exports.SECRET_KEY = NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key';
module.exports.DB_PATH = NODE_ENV === 'production' ? MONGO_PATH : 'mongodb://127.0.0.1:27017/moviesdb';
module.exports.PORT = NODE_ENV === 'production' ? EXPRESS_PORT : 3000;
module.exports.EXPIRE_TOKEN = '7d';
module.exports.saltRounds = 10;
module.exports.corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://movies.explorer.diplom.nomoredomains.sbs',
    'https://movies.explorer.diplom.nomoredomains.sbs',
    'http://api.movies.explorer.diplom.nomoredomains.sbs',
    'https://api.movies.explorer.diplom.nomoredomains.sbs',
    'https://maxiair1.github.io',
  ],
};
