const allowedCors = [
  'http://localhost:3000',
  'https://localhost:3000',
  'localhost:3000',
  'localhost:3000',
  'http://localhost:3001',
  'https://localhost:3001',
  'localhost:3001',
  'localhost:3001',
  'https://api.dmitriysh.nomoredomains.club/',
  'http://api.dmitriysh.nomoredomains.club/',
];

const MONGO_URL = 'mongodb://localhost:27017/moviesdb';

module.exports = {
  allowedCors,
  MONGO_URL,
};
