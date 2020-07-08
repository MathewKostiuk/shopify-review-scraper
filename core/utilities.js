const cheerio = require('cheerio');

class Utilities {
  static generateRpOptions(url, page, isRankPage = false) {
    const uri = isRankPage ? `${url}?page=${page}&sort_by=popularity` :
      `${url}?page=${page}`;
    return {
      uri: uri,
      transform: (body) => {
        return cheerio.load(body)
      }
    }
  }

  static analyzeSentiment(el) {
    if (el.hasClass('icon--review-positive')) {
      return 'positive';
    } else if (el.hasClass('icon--review-neutral')) {
      return 'neutral';
    } else if (el.hasClass('icon--review-negative')) {
      return 'negative';
    }
  }
  
  static formatDate(el) {
    const daysRegex = /(\d{1,2})\s(days?\sago)/;
    const hoursRegex = /(\d{1,2})\s(hours?\sago)/;
    const minutesRegex = /(\d{1,2})\s(minutes?\sago)/;
  
    if (daysRegex.test(el)) {
      const numberOfDays = el.match(daysRegex)[1];
      return new Date(Date.now() - (86400000 * numberOfDays))
    } else if (hoursRegex.test(el)) {
      const numberOfHours = el.match(hoursRegex)[1];
      return new Date(Date.now() - (3600000 * numberOfHours));
    } else if(minutesRegex.test(el)) {
      const numberOfMinutes = el.match(minutesRegex)[1];
      return new Date(Date.now() - (60000 * numberOfMinutes));
    } else {
      return new Date(el);
    }
  }

  static getTotalNumberOfPages($) {
    const numberOfPages = Number($('.next_page').prev().text());
    return numberOfPages > 0 ? numberOfPages : 1;
  }

  static capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static flattenArray(arr, depth = 1) {
    return depth > 0 ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? this.flattenArray(val, depth - 1) : val), [])
      : arr.slice()
  }
  
  static isUnique(review, array) {
    let unique = true;
    for (let i = 0; i < array.length; i ++) {
      if (review.storeTitle === array[i].storeTitle && review.description === array[i].description && review.sentiment === array[i].sentiment) {
        unique = false;
        break;
      }
    }
    return unique;
  }

  static processReviewPercentage($, theme) {
    const percentageRegex = /\d{1,}/g;
    const percentage = $('#Reviews .heading--2').text().match(percentageRegex);
    const entry = {
      percentPositive: Number(percentage[0]),
      name: theme.handle,
      theme: theme.themeId
    }
    return entry;
  }

  static processRankingDataFromPage($, pageNumber, themes) {
    let rankingsFromPage = [];
    $('.theme-info a').each((i, el) => {
      const themeHandle = $(el).attr('data-trekkie-theme-handle');
      const rank = (24 * (pageNumber - 1)) + i + 1;
      for (let j = 0; j < themes.length; j++) {
        if (themes[j].handle === themeHandle) {
          const ranking = {
            rank: rank,
            theme: themes[j].themeId,
            name: themes[j].handle
          }
          rankingsFromPage = [...rankingsFromPage, ranking];
        }
      }
    });
    return [...rankingsFromPage];
  }

  static processReviewDataFromPage($, theme) {
    let reviewsFromPage = [];
    $('.review').each((i, el) => {
      const review = {
        themeId: theme.themeId,
        handle: theme.handle,
        storeTitle: $(el).find('.review-title__author').text(),
        description: $(el).find('.review__body').text(),
        sentiment: this.analyzeSentiment($(el).find('.review-graph__icon')),
        date: this.formatDate($(el).find('.review-title__date').text())
      }
      reviewsFromPage = [...reviewsFromPage, review];
    });
    return reviewsFromPage;
  }
}

module.exports = Utilities;
