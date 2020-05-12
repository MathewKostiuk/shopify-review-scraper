const express = require('express');
const themesRoutes = express.Router();

module.exports = (DataHelpers) => {
  themesRoutes.get('/', async (req, res) => {
    const themes = await DataHelpers.getAllThemes();
    res.json({ themes });
  })

  themesRoutes.get('/:theme', async (req, res) => {
    const themeReviews = await DataHelpers.getReviews(req.params.theme);
    res.json({ themeReviews });
  })

  return themesRoutes;
}


