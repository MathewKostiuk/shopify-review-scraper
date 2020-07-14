const express = require('express');
const themesRoutes = express.Router();

module.exports = (DBAccess) => {
  themesRoutes.get('/', async (req, res) => {
    const themes = await DBAccess.getAllThemes();
    res.json({ themes });
  })

  themesRoutes.get('/:theme', async (req, res) => {
    const theme = await DBAccess.getThemeByHandle(req.params.theme);
    const themeReviews = await DBAccess.getReviews(theme[0].theme_id);
    res.json({ themeReviews });
  })

  return themesRoutes;
}
