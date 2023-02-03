const { Pool } = require('pg');

const POSTGRES_URL = process.env.POSTGRES_URL || 'postgresql://postgres:@localhost:5432/twitter';

const database = new Pool({
  connectionString: POSTGRES_URL
});

async function getTweets() {
  const result = await database.query(`
    SELECT
      tweets.id,
      tweets.message,
      tweets.created_at,
      users.name,
      users.username
    FROM
      tweets
    INNER JOIN users ON
      tweets.user_id = users.id
    ORDER BY created_at DESC;
  `);
  //console.log(result);
  return result.rows;
}

async function getTweetsByUsername(username) {
  const result = await database.query(`
    SELECT
      tweets.id,
      tweets.message,
      tweets.created_at,
      users.name,
      users.username
    FROM
      tweets
    INNER JOIN users ON
      tweets.user_id = users.id
    WHERE
      users.username = $1
    ORDER BY created_at DESC;
  `, [username]);

  return result.rows;
}

async function createTweet(username, text) {
  const userResult = await database.query(`
    SELECT
      users.id
    FROM 
      users
    WHERE
      users.username = $1
  `, [username]);
  const user = userResult.rows[0];

  const tweetResult = await database.query(`
    INSERT INTO tweets
      (message, user_id)
    VALUES
      ($1, $2)
    RETURNING
      id
  `, [text, user.id]);
  const newTweet = tweetResult.rows[0];
  return newTweet;
}

async function getUserByUsername(username) {
  const result = await database.query(`
    SELECT
      *
    FROM
      users 
    WHERE
      username = $1
  `, [username]);
  return result.rows[0];
}

module.exports = {
  getTweets,
  getTweetsByUsername,
  createTweet,
  getUserByUsername,
};