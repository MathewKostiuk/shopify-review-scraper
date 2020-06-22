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
    console.log(success);
    this.processPages();
    this.saveRankings();
  }

  async getThemes() {
    return await DBAccess.getAllThemes();
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

  processRankingDataFromPage($, pageNumber) {
    $('.theme-info a').each((i, el) => {
      const themeHandle = $(el).attr('data-trekkie-theme-handle');
      const rank = (24 * (pageNumber - 1)) + i + 1;
      for (let j = 0; j < this.themes.length; j++) {
        if (this.themes[j].name === themeHandle) {
          const ranking = {
            rank: rank,
            themeId: this.themes[j].themeId,
            themeHandle: this.themes[j].name,
            date: new Date(Date.now())
          }
          this.rankings.push(ranking);
        }
      }
    });
  }
}

module.exports = Rankings;