const express = require('express');
const app = express();
const port = process.env.PORT || 3000

const DBAccess = require('./db/db-access');
const themesRoutes = require('./routes/themes')(DBAccess);

const cron = require('node-cron');
const { checkForNewReviews } = require("./core/cron");
const Rankings = require('./core/rankings');

app.use('/themes', themesRoutes);
app.listen(port);

cron.schedule('1 * * * *', async () => {
  const newReviews = await checkForNewReviews();
  const date = new Date();
  console.log(`Last crawled for reviews on ${date.toLocaleDateString()} at ${date.toLocaleTimeString('en-US')}`);
})

// cron.schedule('0 20 * * *', async () => {
//   const newRankings = await fetchRankingPage();
//   console.log(`Last crawled the leaderboard on ${date.toLocaleDateString()} at ${date.toLocaleTimeString('en-US')}`);
// });

const rankings = new Rankings();
rankings.init();