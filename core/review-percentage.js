const DBAccess = require('../db/db-access');
const Scraper = require('./scraper');

const themesDashboard = require('../services/themes-dashboard');

class ReviewPercentages {
  constructor(brand_id) {
    this.percentages = [];
    this.brand_id = brand_id
  }

  async init() {
    this.themes = await DBAccess.getThemesByBrandId(this.brand_id).catch(e => console.log(e));
    await Promise.all(this.themes.map(async theme => await this.fetchData(theme)))
      .catch(e => console.log(e));
    await DBAccess.savePercentage(this.percentages);
    const payload = this.addHandlesToPayload();
    await themesDashboard.insertReviewsToDashboard(payload);
  }

  async fetchData(theme) {
    const scraper = new Scraper(1, theme);
    await scraper.scrapePage();
    const HTML = scraper.pageHTML;
    const percentage = this.processPercentPositive(HTML, theme);
    this.percentages = [...this.percentages, percentage];
  }

  addHandlesToPayload() {
    return this.percentages.map(obj => {
      for (let i = 0; i < this.themes.length; i++) {
        if (obj.theme_id === this.themes[i].theme_id) {
          return {
            ...obj,
            theme: this.themes[i].handle
          }
        }
      }
    })
  }

  processPercentPositive($, theme) {
    const percentageRegex = /\d{1,}/g;
    const percentage = $('#Reviews .heading--2').text().match(percentageRegex);
    const entry = {
      percent_positive: Number(percentage[0]),
      theme_id: theme.theme_id
    }
    return entry;
  }
}

module.exports = ReviewPercentages;
