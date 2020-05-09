const express = require('express');
const themesRoutes = express.Router();


module.exports = (DataHelpers) => {
  themesRoutes.get('/', async (req, res) => {
    const themes = await DataHelpers.getAllThemes();
    res.json({ themes });
  })

  return themesRoutes;
}


