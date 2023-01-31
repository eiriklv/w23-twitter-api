const express = require('express');
const cors = require('cors');
const app = express();
const { getTweets, getTweetsByUsername, createTweet } = require('./services/database');

const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from Twitter API');
});

app.get('/tweets', async (req, res) => {
  const tweets = await getTweets();
  res.json(tweets);
});

app.get('/tweets/:username', async (req, res) => {
  const { username } = req.params;
  const tweets = await getTweetsByUsername(username);
  res.json(tweets);
});

app.post('/tweets/:username', async (req, res) => {
  const { text } = req.body;
  const { username } = req.params;
  const newTweet = await createTweet(username, text);
  res.json(newTweet);
});

app.listen(PORT, () => {
  console.log(`Twitter API listening to port: ${PORT}`);
})