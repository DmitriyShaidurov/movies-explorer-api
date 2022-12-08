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

const MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb';

module.exports = {
  allowedCors,
  MONGO_URL,
};

/*
    "email": "testuser@mail.ru",
    "password": "test123"

*/

/* {
    "country": "Россия",
    "director": "Снайдер",
    "duration": "25",
    "year": "2008",
    "description": "fsafa",
    "image": "https://avatars.githubusercontent.com/u/94712054?v=4",
    "trailerLink": "https://avatars.githubusercontent.com/u/94712054?v=4",
    "thumbnail": "https://avatars.githubusercontent.com/u/94712054?v=4",
    "movieId": 3,
    "nameRU": "Фильм",
    "nameEN": "Movie"
} */
