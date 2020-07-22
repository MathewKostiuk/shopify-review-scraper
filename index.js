const express = require('express');
const app = express();
const port = process.env.PORT || 3000

const DBAccess = require('./db/db-access');
const themesRoutes = require('./routes/themes')(DBAccess);
const CronJobs = require('./core/cron-jobs');

const Rankings = require('./core/rankings');
const ReviewPercentages = require('./core/review-percentage');

const OOTSReviewsScraper = require('./core/oots-reviews');
const PXUReviewsScraper = require('./core/pxu-reviews');

app.use('/themes', themesRoutes);
app.listen(port);

const pxuReviewsJob = new CronJobs('5 * * * *', 'reviews', PXUReviewsScraper, 1);
const ootsReviewsJob = new CronJobs('40 * * * *', 'reviews', OOTSReviewsScraper, 2);
const pxuLeaderboardJob = new CronJobs('0 20 * * *', 'the leaderboard', Rankings, 1);
const pxuReviewPercentagesJob = new CronJobs('0 21 * * *', 'percent positives', ReviewPercentages, 1);

pxuReviewsJob.run();
pxuLeaderboardJob.run();
pxuReviewPercentagesJob.run();
ootsReviewsJob.run();

const second = new ReviewPercentages(1);
second.init();
