const axios = require('axios');

const DBAccess = require('../db/db-access');
const Scraper = require('./scraper');
const Utilities = require('./utilities');

class Reviews {
  constructor() {
    this.reviews = {};
    this.processedReviews = {};
  }

  async init() {
    this.themes = await DBAccess.getAllThemes().catch(e => console.log(e));
    await Promise.all(this.themes.map(async theme => await this.runScrapers(theme))).catch(e => console.log(e));
    await this.processReviews().catch(e => console.log(e));
    this.dispatchReviews();
    return true;
  }

  async runScrapers(theme) {
    let scrapers = [];
    let pageData = [];
    this.reviews[theme.handle] = [];
    let numberOfPages;

    scrapers.push(new Scraper(theme.url, 1, false));
    pageData.push(await scrapers[0].scrapePage().catch(e => console.log(e)));
    numberOfPages = Utilities.getTotalNumberOfPages(pageData[0]);

    const firstPageReviews = Utilities.processReviewDataFromPage(pageData[0], theme);
    this.reviews[theme.handle] = [...this.reviews[theme.handle], ...firstPageReviews];

    for (let i = 1; i < numberOfPages; i++) {
      scrapers.push(new Scraper(theme.url, i + 1, false));
      pageData.push(await scrapers[i].scrapePage().catch(e => console.log(e)));
      const pageReviews = Utilities.processReviewDataFromPage(pageData[i], theme);
      this.reviews[theme.handle] = [...this.reviews[theme.handle], ...pageReviews];
      console.log(i, this.reviews[theme.handle]);
    }
  }

  pingSlack(review, isNew) {
    const messageHeading = isNew ? `*${review.storeTitle}* left a new ${review.sentiment} review for *${Utilities.capitalizeFirstLetter(review.handle)}*:` :
      `*${review.storeTitle}* removed their ${review.sentiment} review for ${Utilities.capitalizeFirstLetter(review.handle)}:`;

    const options = {
      method: 'post',
      url: `${process.env.SLACK_URL}`,
      data: {
        "text": "This is a test",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `${messageHeading}`
            },
            "block_id": "text1"
          },
          {
            "type": "divider"
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `> ${review.description}`
            }
          }
        ]
      }
    }
    axios(options)
      .then(() => console.log(`Incoming review: ${review}`))
      .catch(error => console.log(error));
  }

  dispatchReviews() {
    const handles = Object.keys(this.processedReviews);

    for (let i = 0; i < handles.length; i++) {
      const handle = handles[i];
      if (this.processedReviews[handle].save) {
        this.processedReviews[handle].save.forEach(async (review) => {
          await DBAccess.saveReview(review).catch(e => console.log(e));
          this.pingSlack(review, true);
        });
      }
      if (this.processedReviews[handle].delete) {
        this.processedReviews[handle].delete.forEach(async (review) => {
          await DBAccess.deleteReview(review).catch(e => console.log(e));
          this.pingSlack(review, false);
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
