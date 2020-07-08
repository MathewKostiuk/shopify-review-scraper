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
    await Promise.all(this.themes.map(async theme => await this.fetchData(theme)))
      .catch(e => console.log(e));
    DBAccess.savePercentage(this.percentages);
  }

  async fetchData(theme) {
    const scraper = new Scraper(theme.url, 1, false);
    const pageData = await scraper.pageData;

    const percentage = Utilities.processReviewPercentage(pageData, theme);
    this.percentages = [...this.percentages, percentage];
  }
}

module.exports = ReviewPercentages;
