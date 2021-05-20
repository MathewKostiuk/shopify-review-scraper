const express = require('express');
const app = express();
const port = process.env.PORT || 3000

const Themes = require('./db/models/themes');
const Reviews = require('./db/models/reviews');
const themesRoutes = require('./routes/themes')(Themes, Reviews);
const CronJobs = require('./core/cron-jobs');

const RankingsScraper = require('./core/rankings-scraper');
const ReviewPercentages = require('./core/review-percentage');

const OOTSReviewsScraper = require('./core/oots-reviews');
const PXUReviewsScraper = require('./core/pxu-reviews');

app.use('/themes', themesRoutes);
app.listen(port);

const pxuReviewsJob = new CronJobs('5 * * * *', 'reviews', PXUReviewsScraper, 1);
const ootsReviewsJob = new CronJobs('40 * * * *', 'reviews', OOTSReviewsScraper, 2);
const fetchRankings = new CronJobs('0 20 * * *', 'the leaderboard', RankingsScraper);
const pxuReviewPercentagesJob = new CronJobs('0 21 * * 5', 'percent positives', ReviewPercentages);

pxuReviewsJob.run();
fetchRankings.run();
pxuReviewPercentagesJob.run();
ootsReviewsJob.run();
