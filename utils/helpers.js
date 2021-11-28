
const createQueryString = ({ url = '', params = {}}) => {

  const queryString = Object.entries(params).reduce((res, [key, value], index) => {
    let iterationValue = (index) ? '&' : '';

    if (value !== null || value !== undefined) {
      iterationValue += `${key}=${value}`;
      return res + iterationValue;
    } else {
      return res;
    }
  }, '?');
  return encodeURI(url + queryString);
}

const isEmptyObject = object => {
  let entryArray = [];
  if (object) {
    entryArray = Object.entries(object);
  }
  return !(entryArray.length > 0)
}


const rawBodyHandler = function (req, res, buf, encoding) {
  if (buf && buf.length) {
      req.rawBody = buf.toString(encoding || 'utf8');
      // console.log('Raw body: ' + req.rawBody);
  }
}

const csvToArray = (str, delimiter = ",") => {

  // slice from start of text to the first \n index
  // use split to create an array from string by delimiter
  const headers = str.slice(0, str.indexOf("\n")).split(delimiter);

  // slice from \n index + 1 to the end of the text
  // use split to create an array of each csv value row
  const rows = str.slice(str.indexOf("\n") + 1).split("\n");

  // Map the rows
  // split values from each row into an array
  // use headers.reduce to create an object
  // object properties derived from headers:values
  // the object passed as an element of the array
  const arr = rows.map(function (row) {
    const values = row.split(delimiter);
    const el = headers.reduce(function (object, header, index) {
      object[header] = values[index];
      return object;
    }, {});
    return el;
  });

  // return the array
  return arr;
}

module.exports = {
  createQueryString,
  isEmptyObject,
  rawBodyHandler,
  csvToArray
};
