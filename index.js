const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3001

const Themes = require('./db/models/themes');
const Reviews = require('./db/models/reviews');
const themesRoutes = require('./routes/themes')(Themes, Reviews);
const apiRouter = require('./routes/api');
const CronJobs = require('./core/cron-jobs');

const RankingsScraper = require('./core/rankings-scraper');
const ReviewPercentages = require('./core/review-percentage');

const OOTSReviewsScraper = require('./core/oots-reviews');
const PXUReviewsScraper = require('./core/pxu-reviews');

app.use(express.json({ limit: '50mb' }));
app.use('/themes', themesRoutes);
app.use('/api/1.0', apiRouter);
app.listen(port);

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, './client/build')));

// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, './client/build/index.html'));
});

const pxuReviewsJob = new CronJobs('5 * * * *', 'reviews', PXUReviewsScraper, 1);
const ootsReviewsJob = new CronJobs('40 * * * *', 'reviews', OOTSReviewsScraper, 2);
const fetchRankings = new CronJobs('0 20 * * *', 'the leaderboard', RankingsScraper);
const pxuReviewPercentagesJob = new CronJobs('0 21 * * 5', 'percent positives', ReviewPercentages);

pxuReviewsJob.run();
fetchRankings.run();
pxuReviewPercentagesJob.run();
ootsReviewsJob.run();
