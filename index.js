const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const apiRouter = require('./routes/api');
const CronJobs = require('./core/cron-jobs');

const ReviewsScraper = require('./core/reviews-scraper');
const RankingsScraper = require('./core/rankings-scraper');
const ReviewPercentages = require('./core/review-percentage');

app.use(express.json({ limit: '50mb' }));
app.use('/api/1.0', apiRouter);
app.listen(port);

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, './client/build')));

// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, './client/build/index.html'));
});

const themeReviewsJob = new CronJobs('5 * * * *', 'reviews', ReviewsScraper);
const themeRankingsJob = new CronJobs('0 20 * * *', 'the leaderboard', RankingsScraper);
const reviewPercentagesJob = new CronJobs('0 21 * * 5', 'percent positives', ReviewPercentages);

themeReviewsJob.run();
themeRankingsJob.run();
reviewPercentagesJob.run();
