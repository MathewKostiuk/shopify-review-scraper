const { getAllThemes, getReviews } = require('./data-helpers');
const { scrapeTheme, getTotalReviewsFromPage, saveReviewDataFromPage } = require('./utils/scraper-helpers');

const checkForNewReviews = async () => {
  const themes = await getAllThemes();
  const themesData = await Promise.all(themes.map(async theme => {
    const reviewsInDB = await getReviews(theme);
    const totalReviewsInDB = reviewsInDB.length;
    const reviewsOnPage = await scrapeTheme(theme, 1, getTotalReviewsFromPage);
    const shouldFetch = totalReviewsInDB !== reviewsOnPage;
    // 4 reviews per page
    const pagesToFetch = Math.ceil((reviewsOnPage - totalReviewsInDB) / 4);

    return {
      ...theme,
      reviewsInDB: totalReviewsInDB,
      reviewsOnPage,
      shouldFetch,
      pagesToFetch
    }
  }));

  const needsFetching = themesData.filter(theme => theme.shouldFetch);

  return needsFetching.length > 0 ? fetchNewReviews(needsFetching) : false;
}

const fetchNewReviews = async (themes) => {
  const themeReviews = await Promise.all(themes.map(async theme => {
    const newReviews = [];
    for (let i = 1; i <= theme.pagesToFetch; i++) {
      const newReviewsFromPage = await scrapeTheme(theme, i, saveReviewDataFromPage);
      newReviews.push(newReviewsFromPage);
    }
    return newReviews;
  }));
  return themeReviews;
}

module.exports = { checkForNewReviews }
