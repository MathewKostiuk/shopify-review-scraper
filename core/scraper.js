const rp = require('request-promise');
const cheerio = require('cheerio');

class Scraper {
  constructor(pageNumber, theme, isRankPage = false) {
    this.pageNumber = pageNumber;
    this.theme = theme;
    this.isRankPage = isRankPage;
    this.options = this.generateRpOptions(this.theme, this.pageNumber);
  }

  get pageHTML() {
    return this.html;
  }

  set pageHTML(pageHTML) {
    this.html = pageHTML;
  }

  async scrapePage() {
    try {
      this.pageHTML = await rp(this.options);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  generateRpOptions(theme, page) {
    const uri = this.isRankPage ?
      `https://themes.shopify.com/themes?page=${page}&sort_by=popularity` :
      `${theme.url}?page=${page}`;
    return {
      uri: uri,
      transform: (body) => {
        return cheerio.load(body)
      }
    }
  }
}

module.exports = Scraper;
