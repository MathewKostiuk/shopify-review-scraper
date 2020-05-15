const rp = require('request-promise');
const cheerio = require('cheerio');

const scrapeTheme = async (theme, page) => {
  const rpOptions = generateRpOptions(theme, page);
  let $;
  try {
    $ = await rp(rpOptions);
  } catch (error) {
    console.log(error);
    return null;
  }
  return $;
}

const generateRpOptions = (theme, page) => {
  return {
    uri: `${theme.url}?page=${page}`,
    transform: (body) => {
      return cheerio.load(body)
    }
  }
}

const getTotalNumberOfPages = ($) => {
  const numberOfPages = Number($('.next_page').prev().text());
  return numberOfPages > 0 ? numberOfPages : 1;
}

const processReviewDataFromPage = ($, theme) => {
  const reviewsFromPage = [];
  $('.review').each((i, el) => {
    const review = {
      themeId: theme.themeId,
      themeTitle: theme.name,
      storeTitle: $(el).find('.review-title__author').text(),
      description: $(el).find('.review__body').text(),
      sentiment: analyzeSentiment($(el).find('.review-graph__icon')),
      date: formatDate($(el).find('.review-title__date').text())
    }
    reviewsFromPage.push(review);
  });
  return reviewsFromPage;
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

module.exports = { scrapeTheme, processReviewDataFromPage, getTotalNumberOfPages }
