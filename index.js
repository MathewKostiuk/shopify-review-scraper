const express = require('express');
const app = express();
const port = process.env.PORT || 3000

const DBAccess = require('./db/db-access');
const themesRoutes = require('./routes/themes')(DBAccess);
const CronJobs = require('./core/cron-jobs');

const Reviews = require('./core/reviews');
const Rankings = require('./core/rankings');
const ReviewPercentages = require('./core/review-percentage');

app.use('/themes', themesRoutes);
app.listen(port);

const reviewsCronJob = new CronJobs('5 * * * *', 'reviews', Reviews);
reviewsCronJob.run();

const leaderboardCronJob = new CronJobs('0 20 * * *', 'the leaderboard', Rankings);
leaderboardCronJob.run();

const reviewPercentagesCronJob = new CronJobs('0 21 * * *', 'percent positives', ReviewPercentages);
reviewPercentagesCronJob.run();

const tester = new Rankings();
tester.init();
