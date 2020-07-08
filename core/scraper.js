const rp = require('request-promise');
const cheerio = require('cheerio');

class Scraper {
  constructor(url, pageNumber, isRankPage) {
    this.options = this.generateRpOptions(url, pageNumber, isRankPage);
  }

  get pageData() {
    return this.scrapePage();
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

  generateRpOptions(url, page, isRankPage = false) {
    const uri = isRankPage ? `${url}?page=${page}&sort_by=popularity` :
      `${url}?page=${page}`;
    return {
      uri: uri,
      transform: (body) => {
        return cheerio.load(body)
      }
    }
  }
}

module.exports = Scraper;
