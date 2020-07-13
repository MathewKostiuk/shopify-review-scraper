const rp = require('request-promise');
const cheerio = require('cheerio');
const Utilities = require('./utilities');

class Scraper {
  constructor(category, pageNumber, theme) {
    this.pageNumber = pageNumber;
    this.category = category;
    this.theme = theme;
    this.options = this.generateRpOptions(theme, pageNumber, category);
    this.processers = {
      'reviews': this.processReviewData.bind(this),
      'rankings': this.processRankingsData.bind(this),
      'percent-positive': this.processPercentPositive.bind(this)
    };
  }

  get pageHTML() {
    return this.html;
  }

  get numberOfPages() {
    return this.pages;
  }

  get result() {
    return this.payload;
  }

  set pageHTML(pageHTML) {
    this.html = pageHTML;
  }

  set numberOfPages(numberOfPages) {
    this.pages = numberOfPages;
  }

  set result(payload) {
    this.payload = payload;
  }

  async scrapePage(isFirstPage = false) {
    try {
      this.pageHTML = await rp(this.options);

      if (isFirstPage) {
        this.numberOfPages = this.getTotalNumberOfPages(this.html);
      }
      this.result = this.processers[this.category](this.html, this.theme);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  generateRpOptions(theme, page, category) {
    const uri = category === 'rankings' ?
      `https://themes.shopify.com/themes?page=${page}&sort_by=popularity` :
      `${theme.url}?page=${page}`;
    return {
      uri: uri,
      transform: (body) => {
        return cheerio.load(body)
      }
    }
  }

  getTotalNumberOfPages($) {
    const numberOfPages = Number($('.next_page').prev().text());
    return numberOfPages > 0 ? numberOfPages : 1;
  }

  processPercentPositive($, theme) {
    const percentageRegex = /\d{1,}/g;
    const percentage = $('#Reviews .heading--2').text().match(percentageRegex);
    const entry = {
      percentPositive: Number(percentage[0]),
      name: theme.handle,
      theme: theme.theme_id
    }
    return entry;
  }

  processRankingsData($, themes) {
    let rankingsFromPage = [];
    $('.theme-info a').each((i, el) => {
      const themeHandle = $(el).attr('data-trekkie-theme-handle');
      // 24 themes per page, i should get offset by 1 due to starting at 0.
      // Subtract the 9 free Shopify themes from the score
      const rank = (24 * (this.pageNumber - 1)) + i + 1 - 9;
      for (let j = 0; j < themes.length; j++) {
        if (themes[j].handle === themeHandle) {
          const ranking = {
            rank: rank,
            theme_id: themes[j].theme_id,
            theme: themes[j].handle
          }
          rankingsFromPage = [...rankingsFromPage, ranking];
        }
      }
    });
    return [...rankingsFromPage];
  }

  processReviewData($, theme) {
    let reviewsFromPage = [];
    $('.review').each((i, el) => {
      const review = {
        theme_id: theme.theme_id,
        handle: theme.handle,
        storeTitle: $(el).find('.review-title__author').text(),
        description: $(el).find('.review__body').text(),
        sentiment: Utilities.analyzeSentiment($(el).find('.review-graph__icon')),
        date: Utilities.formatDate($(el).find('.review-title__date').text())
      }
      reviewsFromPage = [...reviewsFromPage, review];
    });
    return reviewsFromPage;
  }
}

module.exports = Scraper;
