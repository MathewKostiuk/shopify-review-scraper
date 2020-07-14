const DBAccess = require('../db/db-access');
const Scraper = require('./scraper');
const Utilities = require('./utilities');
const insertRankingsInDashboard = require('../services/themes-dashboard');

class Rankings {
  constructor(brand_id) {
    this.url = `https://themes.shopify.com/themes`;
    this.rankings = [];
    this.brand_id = brand_id
  }

  async init() {
    this.themes = await DBAccess.getThemesByBrandId(this.brand_id).catch(e => console.log(e));
    const scraper = new Scraper(1, this.themes, true);
    await scraper.scrapePage();
    const pageHTML = scraper.pageHTML;
    this.numberOfPages = Utilities.getTotalNumberOfPages(pageHTML);

    await this.fetchAllRankings().catch(e => console.log(e));
    await DBAccess.insertRankings(this.rankings);
    const rankingsForDashboard = await this.addHandlesToRankings();
    await insertRankingsInDashboard(rankingsForDashboard);
  }

  async addHandlesToRankings() {
    return await Promise.all(this.rankings.map(async ranking => {
      const theme = await DBAccess.getThemeByID(ranking.theme_id);
      return {
        ...ranking,
        theme: theme[0].handle,
      }
    }));
  }

  async fetchAllRankings() {
    for (let i = 0; i < this.numberOfPages; i++) {
      const pageNumber = i + 1;
      const scraper = new Scraper(pageNumber, this.themes, true);
      await scraper.scrapePage();
      const HTML = scraper.pageHTML;
      const rankingsFromPage = this.processRankingsData(HTML, pageNumber);
      this.rankings = [...this.rankings, ...rankingsFromPage];
    }
    return true;
  }

  processRankingsData($, page) {
    let rankingsFromPage = [];
    $('.theme-info a').each((i, el) => {
      const themeHandle = $(el).attr('data-trekkie-theme-handle');
      // 24 themes per page, i should get offset by 1 due to starting at 0.
      // Subtract the 9 free Shopify themes from the score
      const rank = (24 * (page - 1)) + i + 1 - 9;
      for (let j = 0; j < this.themes.length; j++) {
        if (this.themes[j].handle === themeHandle) {
          const ranking = {
            rank: rank,
            theme_id: this.themes[j].theme_id,
          }
          rankingsFromPage = [...rankingsFromPage, ranking];
        }
      }
    });
    return [...rankingsFromPage];
  }
}

module.exports = Rankings;
