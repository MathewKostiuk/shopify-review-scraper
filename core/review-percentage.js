const axios = require('axios');

const DBAccess = require('../db/db-access');
const Scraper = require('./scraper');
const Utilities = require('./utilities');

class ReviewPercentages {
  constructor() {
    this.percentages = [];
  }

  async init() {
    this.themes = await DBAccess.getAllThemes()
      .catch(e => console.log(e));
    await Promise.all(this.themes.map(async theme => await this.runScraper(theme)))
      .catch(e => console.log(e));
    DBAccess.savePercentage(this.percentages);
  }

  async runScraper(theme) {
    let scrapers = [];
    let pageData = [];

    scrapers.push(new Scraper(theme.url, 1, false));
    pageData.push(await scrapers[0].scrapePage().catch(e => console.log(e)));
    const percentage = Utilities.processReviewPercentage(pageData[0], theme);
    this.percentages = [...this.percentages, percentage];
  }
}

module.exports = ReviewPercentages;
