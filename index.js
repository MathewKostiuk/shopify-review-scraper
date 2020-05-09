const express = require('express');
const app = express();
const port = process.env.PORT || 3000

const DataHelpers = require('./lib/data-helpers');
const ScraperHelpers = require('./lib/utils/scraper-helpers');
const themesRoutes = require('./routes/themes')(DataHelpers, ScraperHelpers);

app.use('/themes', themesRoutes);
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
