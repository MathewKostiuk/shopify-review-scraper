const cheerio = require('cheerio');

class Utilities {
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
}

module.exports = Utilities;
