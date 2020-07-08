const DBAccess = require('../db/db-access');
const Scraper = require('./scraper');
const Utilities = require('./utilities');
const pingSlack = require('../services/slack');

class Reviews {
  constructor() {
    this.reviews = {};
    this.processedReviews = {};
    this.category = 'reviews';
  }

  async init() {
    this.themes = await DBAccess.getAllThemes().catch(e => console.log(e));
    await Promise.all(this.themes.map(async theme => await this.fetchData(theme))).catch(e => console.log(e));
    await this.processReviews().catch(e => console.log(e));
    this.dispatchReviews();
    return true;
  }

  async fetchData(theme) {
    this.reviews[theme.handle] = [];

    const scraper = new Scraper(this.category, 1, theme);
    await scraper.scrapePage(true);
    const numberOfPages = scraper.numberOfPages;
    for (let i = 0; i < numberOfPages; i++) {
      const newScraper = new Scraper(this.category, i + 1, theme);
      await newScraper.scrapePage();
      this.reviews[theme.handle] = [...this.reviews[theme.handle], ...newScraper.result];
    }
  }

  dispatchReviews() {
    const handles = Object.keys(this.processedReviews);

    for (let i = 0; i < handles.length; i++) {
      const handle = handles[i];
      if (this.processedReviews[handle].save) {
        this.processedReviews[handle].save.forEach(async (review) => {
          await DBAccess.saveReview(review).catch(e => console.log(e));
          pingSlack(review, true);
        });
      }
      if (this.processedReviews[handle].delete) {
        this.processedReviews[handle].delete.forEach(async (review) => {
          await DBAccess.deleteReview(review).catch(e => console.log(e));
          pingSlack(review, false);
        });
      }
      if (this.processedReviews[handle].firstLoad) {
        this.processedReviews[handle].firstLoad.forEach(async (review) => await DBAccess.saveReview(review).catch(e => console.log(e)));
      }
    }
  }

  async processReviews() {
    /*
    Determine whether to ping the Slack channel or not. If the DB is empty then we don't 
    want to flood the Slack channel with a tonne of messages. The remaining reviews should be analyzed
    to determine whether they are new reviews or deleted reviews
    */
    const handles = Object.keys(this.reviews);

    for (let i = 0; i < handles.length; i++) {
      const handle = handles[i];
      const reviewsInDB = await DBAccess.getReviews(handle).catch(e => console.log(e));
      if (reviewsInDB && reviewsInDB.length === 0) {
        // Database is empty so just save the reviews and skip the ping to Slack
        this.processedReviews[handle] = {
          firstLoad: this.reviews[handle]
        }
        continue;
      }

      /*
      Determine which theme reviews are new so that we can build an appropriate message
      in Slack.   
      */
      const filteredPageReviews = this.reviews[handle].filter(review => Utilities.isUnique(review, reviewsInDB));

      // Determine which reviews have been deleted
      const filteredDatabaseReviews = reviewsInDB.filter(review => Utilities.isUnique(review, this.reviews[handle]));

      this.processedReviews[handle] = {
        ...this.processedReviews[handle],
        save: filteredPageReviews,
        delete: filteredDatabaseReviews
      };
    }
  }
}

module.exports = Reviews;
