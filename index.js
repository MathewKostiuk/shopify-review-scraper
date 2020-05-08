const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const rp = require('request-promise');
const cheerio = require('cheerio');

const db = require("./data/db.js");

app.get("/themes", async (req, res) => {
  const themes = await db("themes");
  const rpOptions = generateRpOptions(themes);
  rpOptions.forEach((rpOption, index) => {
    rp(rpOption).then(($) => {
      const theme = themes[index];
      getReviewData($, theme);
    })
  })
  res.json({ themes });
});


app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))


const generateRpOptions = (themes) => {
  return themes.map(theme => {
    return {
      uri: theme.url,
      transform: (body) => {
        return cheerio.load(body)
      }
    }
  })
}

const getReviewData = ($, theme) => {
  if ($('.next_page').length) {
    const lastPage = $('.next_page').prev().text();

    for (let i = 1; i <= lastPage; i++) {

      const pageObject = {
        uri: `${theme.url}?page=${i}`,
        transform: function (body) {
          return cheerio.load(body);
        }
      }
      rp(pageObject).then($ => getReviewDataFromPage($, theme))
    }

  } else {
    getReviewDataFromPage($, theme);
  }
}

const getReviewDataFromPage = ($, theme) => {
  $('.review').each((i, el) => {
    db('reviews').insert({
      themeId: theme.themeId,
      themeTitle: theme.name,
      storeTitle: $(el).find('.review-title__author').text(),
      description: $(el).find('.review__body').text(),
      sentiment: analyzeSentiment($(el).find('.review-graph__icon')),
      date: new Date($(el).find('.review-title__date').text())
    }).then(() => {
      console.log('done');
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
