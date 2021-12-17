const Apps = require("../db/models/apps");
const Scraper = require('./scraper');
const AppReviews = require('../db/models/app-reviews');
const pingSlack = require('../services/slack');

class AppReviewsScraper {
  constructor() {
    this.hasError = false;
  }

  async init() {
    this.apps = await Apps.getAllApps().catch((e) => this.handleErrorState(e));
    await Promise.all(this.apps.map(async app => {
      return await this.fetchData(app).catch((e) => this.handleErrorState(e));
    }));
  }

  handleErrorState(e) {
    this.hasError = true;
    console.log(e);
  }

  async fetchData(app) {
    if (this.hasError) {
      return;
    }

    const appReviewsEmpty = await AppReviews.appReviewsEmpty(app.id);
    // Checking the first 3 pages of reviews should cover 99% of cases
    const numberOfPages = 3;

    for (let i = 0; i < numberOfPages; i++) {
      const newScraper = new Scraper(i + 1, app);
      await newScraper.scrapePage().catch((e) => this.handleErrorState(e));
      const currentPageHTML = newScraper.pageHTML;
      this.processReviewData(currentPageHTML, app, appReviewsEmpty);
    }
  }

  processReviewData($, app, empty) {
    $('#reviews [data-review-id]').each((i, el) => {
      const review = {
        app_id: app.id,
        store_title: $(el).find('.review-listing-header__text').text().trim(),
        description: $(el).find('.truncate-content-copy p').text(),
        sentiment: `${$(el).find('[data-rating]').data('rating')} star review`,
      }

      AppReviews.exists(review)
        .then(exists => {
          if (!exists) {
            this.handleNewReview(review, empty, app);
          }
        })
    });
  }

  async handleNewReview(review, empty, app) {
    await AppReviews.save(review).catch(e => this.handleErrorState(e));
    if (!empty) {
      pingSlack(review, app.brand_id, app.handle);
    }
  }
}

module.exports = AppReviewsScraper;
