const express = require('express');
const themesRoutes = express.Router();

module.exports = (DBAccess) => {
  themesRoutes.get('/', async (req, res) => {
    const themes = await DBAccess.getAllThemes();
    res.json({ themes });
  })

  themesRoutes.get('/:theme', async (req, res) => {
    const themeReviews = await DBAccess.getReviews(req.params.theme);
    res.json({ themeReviews });
  })

  return themesRoutes;
}


