const DBAccess = require('../db/db-access');
const Scraper = require('./scraper');
const insertRankingsInDashboard = require('../services/themes-dashboard');

class Rankings {
  constructor() {
    this.url = `https://themes.shopify.com/themes`;
    this.category = 'rankings';
    this.rankings = [];
  }

  async init() {
    this.themes = await DBAccess.getAllThemes().catch(e => console.log(e));
    const scraper = new Scraper(this.category, 1, this.themes);
    await scraper.scrapePage(true);
    this.numberOfPages = scraper.numberOfPages;

    await this.fetchAllRankings().catch(e => console.log(e));
    await DBAccess.insertRankings(this.rankings);
    await insertRankingsInDashboard(this.rankings);
  }

  async fetchAllRankings() {
    for (let i = 0; i < this.numberOfPages; i++) {
      const pageNumber = i + 1;
      const scraper = new Scraper(this.category, pageNumber, this.themes);
      await scraper.scrapePage();
      this.rankings = [...this.rankings, ...scraper.result];
    }
    return true;
  }
}

module.exports = Rankings;
