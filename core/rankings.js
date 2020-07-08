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
    this.scrapers.push(new Scraper(this.url, 1, true));
    this.pageData.push(await this.scrapers[0].scrapePage().catch(e => console.log(e)));
    this.numberOfPages = Utilities.getTotalNumberOfPages(this.pageData[0]);

    await this.fetchAllRankings().catch(e => console.log(e));

    this.pageData.forEach((page, index) => {
      const rankingsFromPage = Utilities.processRankingDataFromPage(page, index + 1, this.themes);
      this.rankings = [...this.rankings, ...rankingsFromPage];
    });
    
    await DBAccess.insertRankings(this.rankings);
    this.insertRankingssToDashboard();
  }

  async getThemes() {
    return await DBAccess.getAllThemes().catch(e => console.log(e));
  }

  async fetchAllRankings() {
    for (let i = 1; i < this.numberOfPages; i++) {
      const pageNumber = i + 1;
      this.scrapers.push(new Scraper(this.url, pageNumber, true));
      this.pageData.push(await this.scrapers[i].scrapePage().catch(e => console.log(e)));
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
