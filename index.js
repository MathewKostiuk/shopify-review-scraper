const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const rp = require('request-promise');
const cheerio = require('cheerio');

const db = require("./data/db.js");

app.get("/reviews", async (req, res) => {
  const reviews = await db("themes");
  res.json({ reviews });
});


app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

const themes = {
  'reach': {
    uri: `https://themes.shopify.com/themes/reach/styles/solid`,
    transform: function (body) {
      return cheerio.load(body);
    }
  },
  'empire': {
    uri: `https://themes.shopify.com/themes/empire/styles/supply`,
    transform: function (body) {
      return cheerio.load(body);
    }
  },
  'grid': {
    uri: `https://themes.shopify.com/themes/grid/styles/bright`,
    transform: function (body) {
      return cheerio.load(body);
    }
  },
  'handy': {
    uri: `https://themes.shopify.com/themes/handy/styles/cool`,
    transform: function (body) {
      return cheerio.load(body);
    }
  },
  'atlantic': {
    uri: `https://themes.shopify.com/themes/atlantic/styles/modern`,
    transform: function (body) {
      return cheerio.load(body);
    }
  },
  'pacific': {
    uri: `https://themes.shopify.com/themes/pacific/styles/cool`,
    transform: function (body) {
      return cheerio.load(body);
    }
  },
  'editions': {
    uri: `https://themes.shopify.com/themes/editions/styles/modern`,
    transform: function (body) {
      return cheerio.load(body);
    }
  },
  'launch': {
    uri: `https://themes.shopify.com/themes/launch/styles/cool`,
    transform: function (body) {
      return cheerio.load(body);
    }
  },
  'startup': {
    uri: `https://themes.shopify.com/themes/startup/styles/home`,
    transform: function (body) {
      return cheerio.load(body);
    }
  },
  'vogue': {
    uri: `https://themes.shopify.com/themes/vogue/styles/elegant`,
    transform: function (body) {
      return cheerio.load(body);
    }
  }
}

const testDb = {
  'reach': {},
  'empire': {},
  'grid': {},
  'handy': {},
  'atlantic': {},
  'pacific': {},
  'editions': {},
  'launch': {},
  'startup': {},
  'vogue': {}
}

for (const theme in themes) {
  rp(themes[theme])
    .then(function ($) {
      parseResponse($, theme);
      getReviewData($, theme);
    })
    .catch(function (err) {
      // Crawling failed or Cheerio choked...
    });
}

const parseResponse = ($, theme) => {
  testDb[theme] = {
    'numberOfReviews': getNumberOfReviews($)
  }
}

const getNumberOfReviews = ($) => {
  const numberRegex = /(\d){1,}/g;
  return {
    'total': $('#ReviewsHeading').text().match(numberRegex)[0],
    'positive': $('#ReviewsHeading').parent().find('.icon--review-positive').next().next().text().match(numberRegex)[0],
    'neutral': $('#ReviewsHeading').parent().find('.icon--review-neutral').next().next().text().match(numberRegex)[0],
    'negative': $('#ReviewsHeading').parent().find('.icon--review-negative').next().next().text().match(numberRegex)[0],
    'percentPostive': $('.heading--2.gutter-bottom-half').text().match(numberRegex)[0]
  }
}

const getReviewData = ($, theme) => {
  const reviews = [];

  if ($('.next_page').length) {
    const pageReviewsPromises = [];
    const lastPage = $('.next_page').prev().text();
    for (let i = 1; i <= lastPage; i++) {
      const pageObject = {
        uri: `${themes[theme].uri}?page=${i}`,
        transform: function (body) {
          return cheerio.load(body);
        }
      }
      const promise = rp(pageObject).then($ => getReviewDataFromPage($, reviews, theme))
      pageReviewsPromises.push(promise);
    }

    Promise.all(pageReviewsPromises)
      .then(results => {
        testDb[theme]['reviews'] = results[0];
      });
  } else {
    testDb[theme]['reviews'] = getReviewDataFromPage($, reviews, theme);
  }
}

const getReviewDataFromPage = ($, reviews, theme) => {
  $('.review').each((i, el) => {
    db('reviews').insert({
      themeTitle: theme,
      storeTitle: $(el).find('.review-title__author').text(),
      description: $(el).find('.review__body').text(),
      sentiment: analyzeSentiment($(el).find('.review-graph__icon')),
      date: '1999-02-02'
    }).then(() => {
      console.log('done');
    })
    reviews.push({
      'storeTitle': $(el).find('.review-title__author').text(),
      'date': $(el).find('.review-title__date').text(),
      'description': $(el).find('.review__body').text(),
      'sentiment': analyzeSentiment($(el).find('.review-graph__icon'))
    });
  });
  return reviews;
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
