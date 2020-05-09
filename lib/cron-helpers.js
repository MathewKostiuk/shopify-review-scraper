const { getAllThemes, getReviews } = require('./data-helpers');
const { scrapeTheme, getTotalReviewsFromPage, saveReviewDataFromPage } = require('./utils/scraper-helpers');

const checkForNewReviews = async () => {
  const themes = await getAllThemes();
  const needsFetching = await Promise.all(themes.map(async theme => {
    const reviewsInDB = await getReviews(theme);
    const totalReviewsInDB = reviewsInDB.length;
    const reviewsOnPage = await scrapeTheme(theme, 1, getTotalReviewsFromPage);
    const shouldFetch = totalReviewsInDB !== reviewsOnPage;
    // 4 reviews per page
    const pagesToFetch = Math.ceil((reviewsOnPage - totalReviewsInDB) / 4);

    if (shouldFetch) {
      return {
        ...theme,
        reviewsInDB: totalReviewsInDB,
        reviewsOnPage,
        shouldFetch,
        pagesToFetch
      }
    }
  }).filter(theme => theme.shouldFetch));

  if (needsFetching.length > 0) {
    needsFetching.forEach(theme => {
      for (let i = 1; i <= theme.pagesToFetch; i++) {
        scrapeTheme(theme, i, saveReviewDataFromPage);
      }
    })
  }
}

module.exports = { checkForNewReviews }
