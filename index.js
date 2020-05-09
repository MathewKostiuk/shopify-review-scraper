const express = require('express');
const app = express();
const port = process.env.PORT || 3000

const DataHelpers = require('./lib/data-helpers');
const themesRoutes = require('./routes/themes')(DataHelpers);

const cron = require('node-cron');
const CronHelpers = require("./lib/cron-helpers");

app.use('/themes', themesRoutes);
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

cron.schedule('1 * * * *', () => {
  console.log('cronning every hour', Date.now())
  CronHelpers.checkForNewReviews();
})
