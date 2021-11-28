const twtitterApi_2 = 'https://twitter.com/i/api';
const twtitterApi_1 = 'https://api.twitter.com';
// api 2
const ADAPTIVE_JSON = `${twtitterApi_2}/2/search/adaptive.json`; 
// api 1 
const ACTIVATE_JSON = `${twtitterApi_1}/1.1/guest/activate.json`; 
// generate baerer token 
const OAUTH2_TOKEN = `${twtitterApi_1}/oauth2/token`; 
// gender api 
const GENDER_JSON = 'https://api.genderize.io'; // eklenecek !

module.exports = {
  ADAPTIVE_JSON,
  ACTIVATE_JSON,
  OAUTH2_TOKEN,
  GENDER_JSON,
};
