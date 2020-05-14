const { getAllThemes } = require('./data-helpers');
const { scrapeTheme, processReviewDataFromPage, getTotalNumberOfPages } = require('./utils/scraper-helpers');

const checkForNewReviews = async () => {
  const themes = await getAllThemes();
  const themesData = await Promise.all(themes.map(async theme => {
    const pageData = await scrapeTheme(theme, 1);
    const pagesToFetch = getTotalNumberOfPages(pageData);

    return {
      ...theme,
      pagesToFetch
    }
  }));
  return await fetchNewReviews(themesData);
}

const fetchNewReviews = async (themes) => {
  const themeReviews = await Promise.all(themes.map(async theme => {
    const newReviews = [];
    for (let i = 1; i <= theme.pagesToFetch; i++) {
      const pageData = await scrapeTheme(theme, i);
      const newReviewsFromPage = await processReviewDataFromPage(pageData, theme);
      newReviews.push(newReviewsFromPage);
    }
    return newReviews;
  }));
  return themeReviews;
}

module.exports = { checkForNewReviews }
