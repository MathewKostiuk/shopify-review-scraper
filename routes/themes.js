const express = require('express');
const themesRoutes = express.Router();

module.exports = (Themes) => {
  themesRoutes.get('/', async (req, res) => {
    const themes = await Themes.getAllThemes();
    res.json({ themes });
  })

  themesRoutes.get('/:theme', async (req, res) => {
    const theme = await Themes.getThemeByHandle(req.params.theme);
    const themeReviews = await Themes.getReviews(theme[0].theme_id);
    res.json({ themeReviews });
  })

  return themesRoutes;
}
