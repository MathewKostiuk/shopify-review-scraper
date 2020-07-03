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
    const success = await this.fetchAllRankings().catch(e => console.log(e));
    this.processPages();
    const response = await this.saveRankings();
    this.saveRankingsToDashboard();
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

  processPages() {
    this.pageData.forEach((page, index) => this.processRankingDataFromPage(page, index + 1));
  }

  async saveRankings() {
    this.rankings.forEach(async ranking => await DBAccess.saveRanking(ranking).catch(e => console.log(e)));
  }

  async saveRankingsToDashboard() {
    console.log(process.env.DASHBOARD_URL);
    if (!process.env.DASHBOARD_URL) {
      return;
    }
    const options = {
      method: 'post',
      url: `${process.env.DASHBOARD_URL}/api/2.0/platform/shopify/themes/rankings`,
      data: this.rankings,
      auth: {
        username: process.env.SCRAPER_USERNAME,
        password: process.env.SCRAPER_PASSWORD
      }
    };
    axios(options)
      .then(() => console.log('Rankings submitted to the Themes Dashboard'))
      .catch(error => console.log(error));
  }

  processRankingDataFromPage($, pageNumber) {
    $('.theme-info a').each((i, el) => {
      const themeHandle = $(el).attr('data-trekkie-theme-handle');
      const rank = (24 * (pageNumber - 1)) + i + 1;
      for (let j = 0; j < this.themes.length; j++) {
        if (this.themes[j].handle === themeHandle) {
          const ranking = {
            rank: rank,
            theme: this.themes[j].themeId,
            name: this.themes[j].handle,
            date: new Date(Date.now())
          }
          this.rankings = [...this.rankings, ranking];
        }
      }
    });
  }
}

module.exports = Rankings;
