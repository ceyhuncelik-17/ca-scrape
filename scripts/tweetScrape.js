
const dayjs = require('dayjs');

const db = require('./models');
const { getGender } = require('./services/genderApi');

let successOperationCount = 0;
let failureOperationCount = 0;

const insertTweetsBatch = (tweets, users) => {
  // deneme amaclı sadece iki tane deger cekerek devam etmek gerek !! 
  const values = Object.values(tweets);
  values.forEach(async (item) => {
    // tek tek her deger icin insert atılacak sadece tek bi connection uzerinden akıs saglamak yeterli olacak 
    const { created_at, display_text_range, favorite_count, full_text, lang, mention_count, reply_count, retweet_count, id_str, user_id_str} = item;

    const screenName = users[user_id_str].screen_name;
    const genderData = await getGender({ name: screenName });

    const tempCreateOp = await db.tweet.create({
      createTime: dayjs(created_at).format('YYYY-MM-DDTHH:mm:ssZ'),
      displayTextRange: display_text_range.join(','),
      favoriteCount: favorite_count,
      fullText: full_text,
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
    });
    
  })
};

module.exports = {
  insertUsersBatch,
  insertTweetsBatch,
};