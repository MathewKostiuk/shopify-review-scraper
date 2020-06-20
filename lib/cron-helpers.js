const axios = require('axios');

const { getAllThemes, getReviews, saveReview, deleteReview, saveRanking } = require('./data-helpers');
const { scrapeTheme, processReviewDataFromPage, getTotalNumberOfPages, processRankingDataFromPage } = require('./utils/scraper-helpers');

const checkForNewReviews = async () => {
  let themes, reviews, savedThemes;
  try {
    themes = await getAllThemes();
  } catch (error) {
    console.log(error);
    return null;
  }
  const themesData = await Promise.all(themes.map(async theme => {
    let pageData;

    try {
      pageData = await scrapeTheme(theme.url, 1);
    } catch (error) {
      console.log(error)
      return null;
    }
    const pagesToFetch = getTotalNumberOfPages(pageData);
    return {
      ...theme,
      pagesToFetch
    }
  }));

  try {
    reviews = await fetchReviews(themesData);
  } catch (error) {
    console.log(error)
    return null;
  }

  const flattenedReviews = flattenArray(reviews, 2);
  const processedThemes = await Promise.all(flattenedReviews.map(async theme => await processReviewsByTheme(theme)));

  try {
    savedThemes = await actionReviews(processedThemes);
  } catch (error) {
    console.log(error)
    return null;
  }
  return savedThemes;
}

const fetchReviews = async (themes) => {
  const themeReviews = await Promise.all(themes.map(async theme => {
    const newReviews = [];
    for (let i = 1; i <= theme.pagesToFetch; i++) {
      let pageData;

      try {
        pageData = await scrapeTheme(theme.url, i);
      } catch (error) {
        console.log(error);
        continue;
      }

      const newReviewsFromPage = processReviewDataFromPage(pageData, theme);
      newReviews.push(newReviewsFromPage);
    }
    return {
      [theme.name]: flattenArray(newReviews)
    };
  }));
  return themeReviews;
}

const processReviewsByTheme = async theme => {
  let databaseResults;
  const currentThemeReviews = Object.values(theme)[0];
  const currentThemeName = Object.keys(theme)[0];

  try {
    databaseResults = await getReviews(currentThemeName);
  } catch (error) {
    console.log(error);
    return null;
  }

  let processed = {};
  // process & save every review, don't send to Slack because it's annoying
  if (databaseResults && databaseResults.length === 0) {
    processed.save = currentThemeReviews;
    processed.pingSlack = false;

    return processed;
  }

  // We need to check if the review already exists within the database
  // If it doesn't, we'll save it and ping Slack
  const filteredPageReviews = currentThemeReviews.filter((review) => {
    return isUnique(review, databaseResults);
  });
  if (filteredPageReviews.length) {
    processed.save = filteredPageReviews;
    processed.pingSlack = true;
  }


  // We need to check if the database entry still exists on the page
  // If it doesn't, we'll delete it and ping Slack
  const filteredDatabaseReviews = databaseResults.filter((review) => {
    return isUnique(review, currentThemeReviews);
  });
  if (filteredDatabaseReviews.length) {
    processed.delete = filteredDatabaseReviews;
    processed.pingSlack = true;
  }

  return processed;
}

const actionReviews = async (themes) => {
  for (let i = 0; i < themes.length; i++) {
    const toSave = themes[i].save;
    const toDelete = themes[i].delete;
    const shouldPingSlack = themes[i].pingSlack;
    if (toSave) {
      toSave.forEach(async review => {
        let savedReview;
        try {
          savedReview = await saveReview(review);
          if (shouldPingSlack) {
            pingSlack(review, true);
          }
        } catch (error) {
          console.log(error);
        }
      });
    }
    if (toDelete) {
      toDelete.forEach(async review => {
        let deletedReview;
        try {
          deletedReview = await deleteReview(review);
          if (shouldPingSlack) {
            pingSlack(review, false);
          }
        } catch (error) {
          console.log(error);
        }
      });
    }
  }
}

const pingSlack = (review, isNew) => {
  const messageHeading = isNew ? `*${review.storeTitle}* left a new ${review.sentiment} review for *${capitalizeFirstLetter(review.themeTitle)}*:` :
    `*${review.storeTitle}* removed their ${review.sentiment} review for ${capitalizeFirstLetter(review.themeTitle)}:`;

  const options = {
    method: 'post',
    url: `${process.env.SLACK_URL}`,
    data: {
      "text": "This is a test",
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `${messageHeading}`
          },
          "block_id": "text1"
        },
        {
          "type": "divider"
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `> ${review.description}`
          }
        }
      ]
    }
  }
  axios(options)
  console.log(`Incoming review: ${review}`);
}

const flattenArray = (arr, depth = 1) => {
  return depth > 0 ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flattenArray(val, depth - 1) : val), [])
    : arr.slice()
}

const isUnique = (review, array) => {
  let unique = true;
  for (let i = 0; i < array.length; i ++) {
    if (review.storeTitle === array[i].storeTitle && review.description === array[i].description && review.sentiment === array[i].sentiment) {
      unique = false;
      break;
    }
  }
  return unique;
}

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const fetchRankingPage = async () => {
  const url = `https://themes.shopify.com/themes`;

  const themes = await getAllThemes();

  const firstPage = await scrapeTheme(url, 1, true);
  const numberOfPages = getTotalNumberOfPages(firstPage);
  const rankings = [];

  for (let i = 1; i <= numberOfPages; i++) {
    const pageData = await scrapeTheme(url, i, true);
    const pageRankings = processRankingDataFromPage(pageData, i, themes);
    rankings.push(pageRankings);
  }
  const flattened = flattenArray(rankings);

  flattened.forEach(ranking => saveRanking(ranking));
  return true;
}

module.exports = { checkForNewReviews, flattenArray, fetchRankingPage }
