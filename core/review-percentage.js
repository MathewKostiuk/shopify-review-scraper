const axios = require('axios');

const DBAccess = require('../db/db-access');
const Scraper = require('./scraper');

class ReviewPercentages {
  constructor() {
    this.percentages = [];
  }

  async init() {
    this.themes = await DBAccess.getAllThemes()
      .catch(e => console.log(e));
    await Promise.all(this.themes.map(async theme => await this.runScrapers(theme)))
      .catch(e => console.log(e));
    console.log('done');
  }

  async runScrapers(theme) {
    let scrapers = [];
    let pageData = [];

    scrapers.push(new Scraper(theme.url, 1, false));
    pageData.push(await scrapers[0].scrapePage().catch(e => console.log(e)));
    
    this.processReviewPercentage(pageData[0], theme);
  }

  processReviewPercentage($, theme) {
    const percentageRegex = /\d{1,}/g;
    const percentage = $('#Reviews .heading--2').text().match(percentageRegex);
    const entry = {
      percentPositive: Number(percentage[0]),
      name: theme.handle,
      theme: theme.themeId
    }
    DBAccess.savePercentage(entry);
  }
}

module.exports = ReviewPercentages;
