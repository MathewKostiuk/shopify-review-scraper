const rp = require('request-promise');
const cheerio = require('cheerio');

const scrapeTheme = async (url, page, isRankPage = false) => {
  const rpOptions = generateRpOptions(url, page, isRankPage);
  let $;
  try {
    $ = await rp(rpOptions);
  } catch (error) {
    console.log(error);
    return null;
  }
  return $;
}

const generateRpOptions = (url, page, isRankPage = false) => {
  const uri = isRankPage ? `${url}?page=${page}&sort_by=popularity` :
    `${url}?page=${page}`;
  return {
    uri: uri,
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

const processRankingDataFromPage = ($, pageNumber, themes) => {
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

module.exports = { scrapeTheme, processReviewDataFromPage, getTotalNumberOfPages, processRankingDataFromPage }
