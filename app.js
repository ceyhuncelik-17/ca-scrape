// libs
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const dayjs = require('dayjs');
const app = express();
const { SERVER_HOST, SERVER_PORT } = require('./configs/constants');
// routers 
const { scrape_all_with_query, scrape_just_one_for_test, sync_database, drop_database } = require('./routes/scrapeRoutes');
const { calculate_frequency_with_paging, calculate_frequency_all, update_frequency_all, update_frequency_with_paging, compose_training_data, compose_result_data } = require('./routes/frequencyRoutes');
const { rawBodyHandler } = require('./utils/helpers');
// cors configs 
// app.use(cors());

app.use(cors({ allowedHeaders: 'Content-Type, Cache-Control' }));
app.options('*', cors());  // enable pre-flight

app.use(bodyParser.json({ verify: rawBodyHandler })); // kontrol etmek gerekiyor 


/* ------------- api routess ------------------------- */

/**
* @param   {['live, ...']} mode    
* @param   {Number}        count  
* @param   {String}        query // like women, violence  
* @return  {Json}
*/
app.get('/get-all', scrape_all_with_query);

/**
* @param   {['live, ...']} mode    
* @param   {1}             count  // constant 
* @param   {String}        query // like women, violence  
* @return  {Json}
*/
app.get('/get-one', scrape_just_one_for_test);

/**
* Body 
* @param   {Number}        page    
* @param   {Number}        pageSize  // constant 
* @return  {Json}
*/
app.post('/calculate-frequency', calculate_frequency_with_paging);

/**
* Body 
* @param   {Number}        page // initial page    
* @param   {Number}        pageSize //  
* @return  {Json}
*/
app.post('/calculate-frequency-all', calculate_frequency_all);

/**
* Body 
* @param   {Number}        page    
* @param   {Number}        pageSize 
* @param   {Array}         keyList 
* @return  {Json}
*/
app.post('/update-frequency', update_frequency_with_paging);

/**
* Body 
* @param   {Number}        page  
* @param   {Number}        pageSize 
* @param   {Array}         keyList  
* @return  {Json}
*/
app.post('/update-frequency-all', update_frequency_all);

/** compose-traning-data
* @param   {}     
* @return  {{ msg: String, composeCase: Boolean, tweetIdList }}
*/  
app.get('/compose-training-data', compose_training_data, compose_result_data);

/** compose-result-data
* @param   {}     
* @return  {{ msg: String, composeCase: Boolean, tweetIdList }}
*/  
app.get('/compose-result-data', compose_result_data);

/** sync-db
* @param   {}     
* @return  {{ msg: String, syncCase: Boolean}}
*/  
app.get('/sync-db', sync_database);

/** drop-db
* @param   {}     
* @return  {{ msg: String, syncCase: Boolean}}
*/  
app.get(`/drop-db-${dayjs().format('YYYYMMDD')}-1701`, drop_database);


app.listen(SERVER_PORT, () => {
  console.log(`${SERVER_PORT} portu dinleniyor !! /drop-db-${dayjs().format('YYYYMMDD')}`);
})
