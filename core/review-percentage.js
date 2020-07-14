const DBAccess = require('../db/db-access');
const Scraper = require('./scraper');

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
    const scraper = new Scraper(1, theme);
    await scraper.scrapePage();
    const HTML = scraper.pageHTML;
    const percentage = this.processPercentPositive(HTML, theme);
    this.percentages = [...this.percentages, percentage];
  }

  processPercentPositive($, theme) {
    const percentageRegex = /\d{1,}/g;
    const percentage = $('#Reviews .heading--2').text().match(percentageRegex);
    const entry = {
      percent_positive: Number(percentage[0]),
      theme: theme.theme_id
    }
    return entry;
  }
}

module.exports = ReviewPercentages;
