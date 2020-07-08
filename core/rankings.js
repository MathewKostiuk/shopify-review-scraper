const axios = require('axios');

const DBAccess = require('../db/db-access');
const Scraper = require('./scraper');
const Utilities = require('./utilities');

class Rankings {
  constructor() {
    this.url = `https://themes.shopify.com/themes`;
    this.rankings = [];
    this.scrapers = [];
    this.pageData = [];
  }

  async init() {
    this.themes = await this.getThemes().catch(e => console.log(e));
    const scraper = new Scraper(this.url, 1, true);
    const pageData = await scraper.pageData;
    this.numberOfPages = Utilities.getTotalNumberOfPages(pageData);

    await this.fetchAllRankings().catch(e => console.log(e));
    await DBAccess.insertRankings(this.rankings);
    this.insertRankingssToDashboard();
  }

  async getThemes() {
    return await DBAccess.getAllThemes().catch(e => console.log(e));
  }

  async fetchAllRankings() {
    for (let i = 0; i < this.numberOfPages; i++) {
      const pageNumber = i + 1;
      const scraper = new Scraper(this.url, pageNumber, true);
      const pageData = await scraper.pageData;
      const rankingsFromPage = Utilities.processRankingDataFromPage(pageData, i + 1, this.themes);
      this.rankings = [...this.rankings, ...rankingsFromPage];
    }
    return true;
  }

  async insertRankingssToDashboard() {
    if (!process.env.DASHBOARD_URL) {
      return;
    }
    
    const options = {
      method: 'post',
      url: `${process.env.DASHBOARD_URL}/api/2.0/platform/shopify/themes/rankings`,
      data: this.rankings,
      auth: {
        username: 'paskit',
        password: process.env.PASKIT_PASSWORD
      }
    };
    axios(options)
      .then(() => console.log('Rankings submitted to the Themes Dashboard'))
      .catch(error => console.log(error));
  }
}

module.exports = Rankings;
