const DBAccess = require('../db/db-access');
const Scraper = require('./scraper');
const Utilities = require('./utilities');
const pingSlack = require('../services/slack');

class Reviews {
  constructor(brand_id) {
    this.brand_id = brand_id;
    this.reviews = {};
    this.processedReviews = {};
    this.hasError = false;
  }

  async init() {
    this.themes = await DBAccess.getThemesByBrandId(this.brand_id).catch(() => this.handleErrorState(e));
    await Promise.all(this.themes.map(async theme => {
      return await this.fetchData(theme).catch(() => this.handleErrorState(e));
    }));
    await this.processReviews().catch(() => this.handleErrorState(e));
    await this.dispatchReviews();
  }

  handleErrorState(e) {
    this.hasError = true;
    console.log(e);
  }

  async fetchData(theme) {
    if (this.hasError) {
      return;
    }
    this.reviews[theme.theme_id] = [];

    const scraper = new Scraper(1, theme);
    await scraper.scrapePage(true);
    const pageHTML = scraper.pageHTML;
    const numberOfPages = Utilities.getTotalNumberOfPages(pageHTML);

    for (let i = 0; i < numberOfPages; i++) {
      const newScraper = new Scraper(i + 1, theme);
      await newScraper.scrapePage().catch(() => this.handleErrorState(e));
      const currentPageHTML = newScraper.pageHTML;
      const reviewsFrompage = this.processReviewData(currentPageHTML, theme);
      this.reviews[theme.theme_id] = [...this.reviews[theme.theme_id], ...reviewsFrompage];
    }
  }

  processReviewData($, theme) {
    let reviewsFromPage = [];
    $('.review').each((i, el) => {
      const review = {
        theme_id: theme.theme_id,
        store_title: $(el).find('.review-title__author').text(),
        description: $(el).find('.review__body').text(),
        sentiment: Utilities.analyzeSentiment($(el).find('.review-graph__icon')),
        date: Utilities.formatDate($(el).find('.review-title__date').text())
      }
      reviewsFromPage = [...reviewsFromPage, review];
    });
    return reviewsFromPage;
  }

  async handleNewReviews(reviews) {
    const theme = await DBAccess.getThemeByID(reviews[0].theme_id).catch(() => this.handleErrorState(e));
    reviews.forEach(async (review) => {
      await DBAccess.saveReview(review).catch(() => this.handleErrorState(e));
      pingSlack(review, true, this.brand_id, theme[0].handle);
    });
  }

  async handleDeletedReviews(reviews) {
    const theme = await DBAccess.getThemeByID(reviews[0].theme_id).catch(() => this.handleErrorState(e));
    reviews.forEach(async (review) => {
      await DBAccess.deleteReview(review).catch(() => this.handleErrorState(e));
      pingSlack(review, false, this.brand_id, theme[0].handle);
    });
  }

  async handleFirstLoad(reviews) {
    reviews.forEach(async (review) => await DBAccess.saveReview(review).catch(() => this.handleErrorState(e)));
  }

  async dispatchReviews() {
    if (this.hasError) {
      return;
    }
    const themeIDs = Object.keys(this.processedReviews);
    for (let i = 0; i < themeIDs.length; i++) {
      const themeID = themeIDs[i];
      if (this.processedReviews[themeID].save) {
        await this.handleNewReviews(this.processedReviews[themeID].save).catch(() => this.handleErrorState(e));
      }
      if (this.processedReviews[themeID].delete) {
        await this.handleDeletedReviews(this.processedReviews[themeID].delete).catch(() => this.handleErrorState(e));

      }
      if (this.processedReviews[themeID].firstLoad) {
        await this.handleFirstLoad(this.processedReviews[themeID].firstLoad).catch(() => this.handleErrorState(e));
      }
    }
  }

  async processReviews() {
    if (this.hasError) {
      return;
    }
    /*
    Determine whether to ping the Slack channel or not. If the DB is empty then we don't 
    want to flood the Slack channel with a tonne of messages. The remaining reviews should be analyzed
    to determine whether they are new reviews or deleted reviews
    */
    const themeIDs = Object.keys(this.reviews);

    for (let i = 0; i < themeIDs.length; i++) {
      const themeID = themeIDs[i];
      const reviewsInDB = await DBAccess.getReviews(themeID).catch(() => this.handleErrorState(e));
      if (reviewsInDB && reviewsInDB.length === 0) {
        // Database is empty so just save the reviews and skip the ping to Slack
        this.processedReviews[themeID] = {
          firstLoad: this.reviews[themeID]
        }
        continue;
      }

      /*
      Determine which theme reviews are new so that we can build an appropriate message
      in Slack.   
      */
      const filteredPageReviews = this.reviews[themeID].filter(review => Utilities.isUnique(review, reviewsInDB));

      // Determine which reviews have been deleted
      const filteredDatabaseReviews = reviewsInDB.filter(review => Utilities.isUnique(review, this.reviews[themeID]));

      this.processedReviews[themeID] = {
        ...this.processedReviews[themeID],
        save: filteredPageReviews.length > 0 ? filteredPageReviews : null,
        delete: filteredDatabaseReviews.length > 0 ? filteredDatabaseReviews : null
      };
    }
  }
}

module.exports = Reviews;
