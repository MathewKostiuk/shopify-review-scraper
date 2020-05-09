const rp = require('request-promise');
const cheerio = require('cheerio');
const DataHelpers = require('../data-helpers');

const scrapeTheme = async (theme, page, callback) => {
  const rpOptions = generateRpOptions(theme, page);
  const $ = await rp(rpOptions);
  return callback($, theme);
}

const generateRpOptions = (theme, page) => {
  return {
    uri: `${theme.url}?page=${page}`,
    transform: (body) => {
      return cheerio.load(body)
    }
  }
}

const getTotalReviewsFromPage = ($, theme) => {
  const numRegex = /\d+/g;
  return Number($('#ReviewsHeading').text().match(numRegex)[0]);
}

const saveReviewDataFromPage = ($, theme) => {
  $('.review').each((i, el) => {
    DataHelpers.saveReview({
      themeId: theme.themeId,
      themeTitle: theme.name,
      storeTitle: $(el).find('.review-title__author').text(),
      description: $(el).find('.review__body').text(),
      sentiment: analyzeSentiment($(el).find('.review-graph__icon')),
      date: formatDate($(el).find('.review-title__date').text())
    })
  });
}

const analyzeSentiment = (el) => {
  if (el.hasClass('icon--review-positive')) {
    return 'positive';
  } else if (el.hasClass('icon--review-neutral')) {
    return 'neutral';
  } else if (el.hasClass('icon--review-negative')) {
    return 'negative';
  }
}

const formatDate = (el) => {
  const daysRegex = /(\d{1,2})\s(days?\sago)/;
  const hoursRegex = /(\d{1,2})\s(hours?\sago)/;

  if (daysRegex.test(el)) {
    const numberOfDays = el.match(daysRegex)[1];
    return new Date(Date.now() - (86400000 * numberOfDays))
  } else if (hoursRegex.test(el)) {
    const numberOfHours = el.match(hoursRegex)[1];
    return new Date(Date.now() - (3600000 * numberOfHours));
  } else {
    return new Date(el);
  }
}

module.exports = { scrapeTheme, getTotalReviewsFromPage, saveReviewDataFromPage }
