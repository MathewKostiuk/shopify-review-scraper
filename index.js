const express = require('express');
const app = express();
const port = process.env.PORT || 3000

const DataHelpers = require('./lib/data-helpers');
const themesRoutes = require('./routes/themes')(DataHelpers);

const cron = require('node-cron');
const { checkForNewReviews } = require("./lib/cron-helpers");

app.use('/themes', themesRoutes);
app.listen(port);

cron.schedule('1 * * * *', async () => {
  const newReviews = await checkForNewReviews();
  console.log('Check completed');
})

