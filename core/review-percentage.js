const DBAccess = require('../db/db-access');
const Scraper = require('./scraper');

class ReviewPercentages {
  constructor() {
    this.percentages = [];
    this.category = 'percent-positive';
  }

  async init() {
    this.themes = await DBAccess.getAllThemes()
      .catch(e => console.log(e));
    await Promise.all(this.themes.map(async theme => await this.fetchData(theme)))
      .catch(e => console.log(e));
    DBAccess.savePercentage(this.percentages);
  }

  async fetchData(theme) {
    const scraper = new Scraper(this.category, 1, theme);
    await scraper.scrapePage();
    this.percentages = [...this.percentages, scraper.result];
  }
}

module.exports = ReviewPercentages;
