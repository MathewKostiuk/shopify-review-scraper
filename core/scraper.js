const rp = require('request-promise');
const Utilities = require('./utilities');

class Scraper {
  constructor(url, pageNumber, isRankPage) {
    this.url = url;
    this.pageNumber = pageNumber;
    this.isRankPage = isRankPage;
    this.options = Utilities.generateRpOptions(this.url, this.pageNumber, this.isRankPage);
  }

  async scrapePage() {
    let $;
    try {
      $ = await rp(this.options);
    } catch (error) {
      console.log(error);
      return null;
    }
    return $;
  }
}

module.exports = Scraper;
