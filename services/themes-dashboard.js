const axios = require('axios');

async function insertRankingsToDashboard(rankings) {
  console.log(rankings);
  if (!process.env.DASHBOARD_URL) {
    return;
  }
  
  const options = {
    method: 'post',
    url: `${process.env.DASHBOARD_URL}/api/2.0/platform/shopify/themes/rankings`,
    data: rankings,
    auth: {
      username: 'paskit',
      password: process.env.PASKIT_PASSWORD
    }
  };
  axios(options)
    .then(() => console.log('Rankings submitted to the Themes Dashboard'))
    .catch(error => console.log(error));
}

module.exports = insertRankingsToDashboard;
