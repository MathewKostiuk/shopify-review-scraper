const axios = require('axios');
const Utilities = require('../core/utilities');

function pingSlack(review, isNew, brand_id, handle) {
  const messageHeading = isNew ? `*${review.store_title}* left a new ${review.sentiment} review for *${Utilities.capitalizeFirstLetter(handle)}*:` :
    `*${review.store_title}* removed their ${review.sentiment} review for ${Utilities.capitalizeFirstLetter(handle)}:`;

  const url = determineURL(review.sentiment, brand_id, isNew);
  const options = {
    method: 'post',
    url: url,
    data: {
      "text": "This is a test",
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `${messageHeading}`
          },
          "block_id": "text1"
        },
        {
          "type": "divider"
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `> ${review.description}`
          }
        }
      ]
    }
  }
  axios(options)
    .then(() => console.log(`Incoming review: ${review}`))
    .catch(error => console.log(error));
}

function determineURL(sentiment, brand_id, isNew) {
  console.log(sentiment, isNew, brand_id);
  if (brand_id === 1) {
    return `${process.env.SLACK_URL}`;
  } else if (sentiment === 'negative' && isNew === false) {
    return `${process.env.OOTS_SUPPORT_URL}`;
  } else if (sentiment === 'positive' && isNew === true) {
    return `${process.env.OOTS_SUPPORT_URL}`;
  } else if (sentiment === 'negative' && isNew === true) {
    return `${process.env.OOTS_MERCHANT_ADVOCATES_URL}`;
  } else if (sentiment === 'positive' && isNew === false) {
    return `${process.env.OOTS_MERCHANT_ADVOCATES_URL}`;
  } else if (sentiment === 'neutral') {
    return `${process.env.OOTS_MERCHANT_ADVOCATES_URL}`;
  }
}

module.exports = pingSlack;
