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
  
  static processReviewDataFromPage($, theme) {
    const reviewsFromPage = [];
    $('.review').each((i, el) => {
      const review = {
        themeId: theme.themeId,
        themeTitle: theme.name,
        storeTitle: $(el).find('.review-title__author').text(),
        description: $(el).find('.review__body').text(),
        sentiment: Utilities.analyzeSentiment($(el).find('.review-graph__icon')),
        date: Utilities.formatDate($(el).find('.review-title__date').text())
      }
      reviewsFromPage.push(review);
    });
    return reviewsFromPage;
  }
}

module.exports = Scraper;
