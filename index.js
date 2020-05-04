const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const rp = require('request-promise');
const cheerio = require('cheerio');

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

for (const theme in themes) {
  rp(themes[theme])
    .then(function ($) {
      parseResponse($);
    })
    .catch(function (err) {
      // Crawling failed or Cheerio choked...
    });
}

const parseResponse = ($) => {
  const numberRegex = /(\d){1,}/g;
  const $reviewsDiv = $('#Reviews .grid__item--desktop-up-5').html();
  const numberOfReviews = $('#ReviewsHeading').text().match(numberRegex)[0];
  console.log(numberOfReviews);
}

