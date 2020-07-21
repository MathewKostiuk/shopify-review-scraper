const fetch = require('node-fetch');

async function insertRankingsToDashboard(rankings) {
  if (!process.env.DASHBOARD_URL) {
    return;
  }

  const webhook = `${process.env.DASHBOARD_URL}/api/2.0/themes/rankings`;

  fetch(
    webhook,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${process.env.PASKIT_PASS}`
      },
      body: JSON.stringify(rankings),
    },
  ).catch(error => console.log(error));
}

async function insertReviewsToDashboard(reviews) {
  if (!process.env.DASHBOARD_URL) {
    return;
  }

  const webhook = `${process.env.DASHBOARD_URL}/api/2.0/themes/reviews`;

  fetch(
    webhook,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${process.env.PASKIT_PASS}`
      },
      body: JSON.stringify(reviews),
    },
  ).catch(error => console.log(error));
}

module.exports = {
  insertRankingsToDashboard,
  insertReviewsToDashboard
};
