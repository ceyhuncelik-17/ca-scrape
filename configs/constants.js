// server params 
const SERVER_PORT = 8080;
const SERVER_HOST = 'localhost';

// tokens 
const BAERER_TOKEN_2 = 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs=1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';
const BAERER_TOKEN = 'Bearer AAAAAAAAAAAAAAAAAAAAAFXzAwAAAAAAMHCxpeSDG1gLNLghVe8d74hl6k4%3DRUMF4xAQLsbeBhTSRrCiQpJtxoGWeyHrDb5te2jpGskWDFW82F'; // sanırsam bu token mobile den gelme falan kontrol edilecek 
const BAERER_TOKEN_3 = 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA'; // 3 
// twitter api queryString constants
const QUERY_STRING_CONSTANTS = {
  include_profile_interstitial_type: 1,
  include_blocking: 1,
  include_blocked_by: 1,
  include_followed_by: 1,
  include_want_retweets: 1,
  include_mute_edge: 1,
  include_can_dm: 1,
  include_can_media_tag: 1,
  skip_status: 1,

  cards_platform: 'Web-12',
  include_cards: 1,
  include_ext_alt_text: true,
  include_quote_count: true,
  include_reply_count: 1,
  // tweet_mode: 'extended',
  include_entities: true,
  include_user_entities: true,
  include_ext_media_color: true,
  include_ext_media_availability: true,
  send_error_codes: true,
  simple_quoted_tweets: true,
  // query_source: 'spelling_expansion_revert_click',
  query_source: 'typed_query',
  pc: 1,
  spelling_corrections: 1,
  ext: 'ext=mediaStats%2ChighlightedLabel',
};

const TOKEN_QUERY_STRINGS_CONSTANTS = {
  grant_type: 'client_credentials'
};
const BASIC_AUTH = {
  username: 'MilI7pABKuEjQWUl7xRRKdawW', // CONSUMER_KEY
  password: 'DGdX3tkvMX0hAvSolKCqHUnwyMVgrUh2wNv6BJeQHA8THaHchl' // CONSUMER_SECRET
  // consumer_key = 'MilI7pABKuEjQWUl7xRRKdawW'
  // consumer_secret = 'DGdX3tkvMX0hAvSolKCqHUnwyMVgrUh2wNv6BJeQHA8THaHchl'
  // access_token = '4344164925-euE6IEdtkb34SzjXr27B5r1EtihKYtN4s2dlgwh'
  // access_token_secret = 'RlAMcmPkUrQhdBc1kVTfVjdaS2nUzODKKNYXSzBPtpBLc'
}
// twitter request header constants 
const USER_AGENT  = 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 93.0.0.14.101 (iPhone10,4; iOS 12_2; en_US; en-US; scale=2.00; gamut=normal; 750x1334; 153868846)';   
const ORIGIN      = 'https://twitter.com';

const DB_CONFIGS = {
  host:           'localhost',
  port:            3306,
  user:           'root',
  password:       '1234',
  // database:       'ca-scrape',
  database:       'dbForTest',
  dialect:        'mysql',
  queryTimeout:    6000,
  connectTimeout:  60000,
  insecureAuth:    true,
  // operatorAliases: false,
  // dialect options
  dialectOptions: {
    options: {
      requestTimeout:    6000,
      connectionTimeout: 60000,
    }
  },
  // poll params 
  pool: {
    max:     5,     // max number of connection
    min:     0,     // min number of connection
    idle:    10000, // max time in ms that a connection  can be idle  before being released
    acquire: 30000  // max time in ms that pool will try to get connection before throwing error 
  },
  loggin: false, // loggin default true and console.log
};

const ATTR_SET_ID = 1124;  

const CLASSIFICATION_KEYWORDS_LOOKUP = [
  // siddet oldugunu belirten 
  { id: 1, value: 'violence' },
  { id: 2, value: 'abuse' },
  { id: 3, value: 'assault' },
  { id: 4, value: 'rape' },
  { id: 5, value: 'harass' },
  { id: 6, value: 'murder' },
  { id: 7, value: 'gender' },
  { id: 8, value: 'base' },
  { id: 9, value: 'sexual' },
  { id: 10, value: 'kill' },
  { id: 11, value: 'homicide' },
  { id: 12, value: 'wild' },
  { id: 13, value: 'villain' },
  { id: 14, value: 'attack' },
  { id: 15, value: 'crime' },
  // yoneltme icin 
  { id: 16, value: 'against' },  
  { id: 17, value: 'to' },  
  { id: 18, value: 'of' },
  
  // kadın ile ilgili oldugunu belirtmek amaclı eklenenler 
  // herhangi bir kadın ismi gecmesi halinde de oyle ancak bunu nasıl yakalarız ?? 
  { id: 19, value: 'women' },
  { id: 20, value: 'woman' },
  { id: 21, value: 'her' },
  { id: 22, value: 'girl' },
  { id: 23, value: 'female' },
  // alakasız kelimeler
  // 
  { id: 24, value: 'racism' },
  { id: 25, value: 'tax' },
  { id: 26, value: 'happy' },
  { id: 27, value: 'good' },
  { id: 28, value: 'joke' },
  { id: 29, value: 'frog' },
  { id: 30, value: 'lion' },
  { id: 31, value: 'cat' },
  { id: 32, value: 'dog' },
  { id: 33, value: 'fish' },
  { id: 34, value: 'book' },
  { id: 35, value: 'novel' },
  { id: 36, value: 'poem' },
  // en son eklenen karısıklar 
  { id: 37, value: 'daughter' },
  { id: 38, value: 'beater' }, // dovmek 
  { id: 39, value: 'domestic' }, // aile ici 
  { id: 40, value: 'molestation' }, // sarkıntılık taciz 
  // { id: 41, value: 'negative' } 
  // { id: 42, value: 'not' } 
  ,
];

module.exports = {
  BAERER_TOKEN,
  BAERER_TOKEN_2,
  BAERER_TOKEN_3,
  QUERY_STRING_CONSTANTS,
  TOKEN_QUERY_STRINGS_CONSTANTS,
  BASIC_AUTH,
  USER_AGENT,
  ORIGIN,
  
  DB_CONFIGS,

  SERVER_HOST,
  SERVER_PORT,

  ATTR_SET_ID,
  CLASSIFICATION_KEYWORDS_LOOKUP,
};