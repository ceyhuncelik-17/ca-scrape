const { default: axios } = require("axios")


const get = async (url, options) => {
  return new Promise((resolve, reject) => {
    axios.get(url, options)
      .then(res => {
        resolve(res);
        return { data: res, simpleCode: 'success' };
      })
      .catch(err => {
        reject(err);
        return { data: err, simpleCode: 'failure' };
      });
    })
}
  
const post = async (url, data, options) => {  
    return new Promise((resolve, reject) => {
      axios.post(url, data, options)
      .then(res => {
        resolve(res);
        return { data: res, simpleCode: 'success' };
      })
      .catch(err => {
        reject(err);
        return { data: err, simpleCode: 'failure' };
      });
  })
}

module.exports = {
  get, 
  post,
};