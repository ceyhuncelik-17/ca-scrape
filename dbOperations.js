
const mysql = require('mysql')
const dayjs = require('dayjs');

const db = require('./models');
const { getGender } = require('./services/genderApi');

let successOperationCount = 0;
let failureOperationCount = 0;

const connectToggle = (toggle = 'start', connectionRef) => {
  
  if (toggle === 'start') {
    const connection = mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '1234',
      database: 'ca-scrape',
      queryTimeout: 6000,
      connectTimeout: 60000,
      insecureAuth : true,
    });
    
    connection.connect(err => {
      if (err) {
        console.log(err);
      }
    });
    return connection;
  } else if (toggle === 'end') {
    connectionRef.end(err => {
      if (err) {
        console.log(err);
      }
    });
  }
}



const insertTweets = async (tweets) => {
  const insertConn = await connectToggle('start');
  const queries = insertMapGenerator(tweets);
  queries.forEach(async (item) => {
    await insertConn.query(item, (err, result) => {
      if (err) {
        console.error("Basarısız \n");
        // return err;
      } else {
        console.warn(result, 'insert islem sonucu ')
        // return result;
      }
    })
  });
  await connectToggle('end', insertConn);
  // return resultArray;
}


const insertMapGenerator = (tweets) => {
  const values = Object.values(tweets);
  const insertMap = values.map((item, index) => {
    const { created_at, display_text_range, favorite_count, full_text, lang, mention_count, reply_count, retweet_count, id_str, user_id_str} = item;
    return " INSERT INTO `tweets`(`createTime`, `displayTextRange`, `favoriteCount`, `fullText`, `lang`, `mentionCount`, `pullDate`, `replyCount`, `retweetCount`, `tweetId`, `userName`, `gender`,) "
          + "VALUES("
          +"'"+dayjs(created_at).format('YYYY-MM-DDTHH:mm:ssZ')+"',"
          +"'"+display_text_range.join(',')+"',"
          +""+favorite_count+","
          +"'"+full_text.replace(/(\r\n|\n|\r|')/gm, " ").replace(/[^a-z| 0-9]/gm, ' ')+"',"
          // +"'"+full_text.replace(/(\r\n|\n|\r|')/gm, " ").replace(/[^a-z| 0-9]/gm, ' ')+"',"
          +"'"+lang+"',"
          +""+ (mention_count || '0')+","
          +"'"+dayjs().format('YYYY-MM-DDTHH:mm:ssZ')+"',"
          +""+reply_count+","
          +""+retweet_count+","
          +"'"+id_str+"',"
          +"'"+user_id_str+"',"
          +"'"+'gender'+"'"
          + "); ";

  });
  return insertMap;
}

const newInsertTweetsBatch = (tweets, users) => {
  // deneme amaclı sadece iki tane deger cekerek devam etmek gerek !! 
  const values = Object.values(tweets);
  values.forEach(async (item) => {
    // tek tek her deger icin insert atılacak sadece tek bi connection uzerinden akıs saglamak yeterli olacak 
    const { created_at, display_text_range, favorite_count, full_text, text, lang, mention_count, reply_count, retweet_count, id_str, user_id_str} = item;

    const screenName = users[user_id_str].screen_name;
    const genderData = await getGender({ name: screenName });

    const tempCreateOp = await db.tweet.create({
      createTime: dayjs(created_at).format('YYYY-MM-DDTHH:mm:ssZ'),
      displayTextRange: display_text_range ? display_text_range.join(',') : `0,${full_text ? full_text.length : text.length}`,
      favoriteCount: favorite_count,
      fullText: full_text || text,
      lang: lang,
      mentionCount: mention_count,
      pullDate: dayjs().format('YYYY-MM-DDTHH:mm:ssZ'),
      replyCount: reply_count,
      retweetCount: retweet_count,
      tweetId: id_str,
      userName: users[user_id_str].screen_name,
      userId: user_id_str,
      gender: (genderData && genderData.status === 'success' && genderData.probability > 0.5 ) ? genderData.gender : '',
    })
    .then(res => {
      console.log('Basarılı islem sayısı -> ' + ++successOperationCount + '\n');
    })
    .catch(err => {
      
      console.warn('Basarısız islem sayısı -> ' + ++failureOperationCount + '\n');
    })

  });
}

const insertUsersBatch = (users) => {
  const values = Object.values(users);
  values.forEach(async (item) => {
    const { id_str, name, screen_name, location, description, protected, followers_count, friends_count, favorites_count, verified, status_count, created_at } = item;
    const tempCreateOp = await db.user.create({
      userId: id_str,
      name: name,
      screenName: screen_name,
      location: location,
      description: description,
      protected: protected,
      followersCount: followers_count,
      friendsCount: friends_count,
      favoritesCount: favorites_count,
      verified: verified,
      statusCount: status_count,
      pullDate: dayjs().format('YYYY-MM-DDTHH:mm:ssZ'),
      createTime: dayjs(created_at).format('YYYY-MM-DDTHH:mm:ssZ'),
    }).then(res => {
      console.log('kullanıcı basarılı bir sekilde kaydedildi');
    }).catch(err => {
      console.warn('Kullanıcı bir sorundan dolayı kaydedilemedi mukerrer kayıt olabilir');
    });
    
  })
};

module.exports = {
  insertTweets,
  insertUsersBatch,
  newInsertTweetsBatch,
}


// sadeceinsert etmemiz yeterli olacak gibi 
// bu arkadasları sciprt altına eklemek gerek sanırsam bilemedim ki 

// diger isler icin gereken db akısınıda ayırmak gerek tek bi yerde devap etmesin burdan cıkaralım zaten karısmıs gibi 
// direk olarak route icinden scripts frequency cagırırız 
// onun icinde veri ceker 
// cekilen verileri 
