const rp = require('request-promise');
const Utilities = require('./utilities');

class Scraper {
  static async scrapeTheme (url, page, isRankPage = false) {
    const rpOptions = Utilities.generateRpOptions(url, page, isRankPage);
    let $;
    try {
      $ = await rp(rpOptions);
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
  
  static processRankingDataFromPage($, pageNumber, themes) {
    const rankingsFromPage = [];
    $('.theme-info a').each((i, el) => {
      const themeHandle = $(el).attr('data-trekkie-theme-handle');
      const rank = (24 * (pageNumber - 1)) + i + 1;
  
      for (let j = 0; j < themes.length; j++) {
        if (themes[j].name === themeHandle) {
          const ranking = {
            rank: rank,
            themeId: themes[j].themeId,
            themeHandle: themes[j].name,
            date: new Date(Date.now())
          }
          rankingsFromPage.push(ranking);
        }
      }
    });
    return rankingsFromPage
  }
}

module.exports = Scraper;
