const Themes = require('../db/models/themes');
const Reviews = require('../db/models/reviews');
const Scraper = require('./scraper');
const Utilities = require('./utilities');
const pingSlack = require('../services/slack');

class ReviewsScraper {
  constructor() {
    this.hasError = false;
  }

  async init() {
    this.themes = await Themes.getAllThemes().catch((e) => this.handleErrorState(e));
    await Promise.all(this.themes.map(async theme => {
      return await this.fetchData(theme).catch((e) => this.handleErrorState(e));
    }));
  }

  handleErrorState(e) {
    this.hasError = true;
    console.log(e);
  }

  async fetchData(theme) {
    if (this.hasError) {
      return;
    }

    const themeReviewsEmpty = await Reviews.themeReviewsEmpty(theme.theme_id);

    // Checking the first 3 pages of reviews should cover 99% of cases
    const numberOfPages = 3;

    for (let i = 0; i < numberOfPages; i++) {
      const newScraper = new Scraper(i + 1, theme);
      await newScraper.scrapePage().catch((e) => this.handleErrorState(e));
      const currentPageHTML = newScraper.pageHTML;
      this.processReviewData(currentPageHTML, theme, themeReviewsEmpty);
    }
  }

  processReviewData($, theme, themeReviewsEmpty) {
    $('#ReviewsTabContent .review').each((i, el) => {
      const review = {
        theme_id: theme.theme_id,
        store_title: $(el).find('.review-title__author').first().text(),
        description: $(el).find('.review__body').text(),
        sentiment: Utilities.analyzeSentiment($(el).find('.review-graph__icon'))
      }

      Reviews.exists(review)
        .then(exists => {
          if (!exists) {
            this.handleNewReview(review, themeReviewsEmpty, theme);
          }
        });
    });
  }

  async handleNewReview(review, themeReviewsEmpty, theme) {
    await Reviews.save(review).catch((e) => this.handleErrorState(e));
    if (!themeReviewsEmpty) {
      pingSlack(review, theme.brand_id, theme.handle);
    }
  }
}

module.exports = ReviewsScraper;
