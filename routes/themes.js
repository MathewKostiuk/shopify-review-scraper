const express = require('express');
const themesRoutes = express.Router();


module.exports = (DataHelpers, ScraperHelpers) => {
  themesRoutes.get('/', async (req, res) => {
    const themes = await DataHelpers.getAllThemes();
    const rpOptions = ScraperHelpers.generateRpOptions(themes);
    rpOptions.forEach((rpOption, index) => {
      const theme = themes[index];
      ScraperHelpers.scrapeTheme(rpOption, theme);
    })
    res.json({ themes });
  })

  return themesRoutes;
}


