
const { get } = require('../utils/request');
const { createQueryString } = require('../utils/helpers');
const { GENDER_JSON } = require('./paths');
// TODO: gender api iel doldurulacak geri donus degeir sadece male/ female olacak 
// parametre olarak isim soy isim ve lang degerleri alması yeterli oalcaktır 
// unutmadan isimlendirmelerde screen name degil diger isim alınabilir 
const getGender = ({ name, lang }) => {
  const urlWithQuery = createQueryString({ url: GENDER_JSON, params: { name }}) 
  get(urlWithQuery)
    .then(res => {
      // console.log(res.data, 'genderapi results');
      // return islemleri !! 
      return { status: 'success', ...res.data };
    })
    .catch((err => {
      return { status: 'failure', ...err };
    }));
}

module.exports = {
  getGender,
};
