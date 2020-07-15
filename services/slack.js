const axios = require('axios');
const Utilities = require('../core/utilities');

function pingSlack(review, isNew, brand_id, handle) {
  const messageHeading = isNew ? `*${review.store_title}* left a new ${review.sentiment} review for *${Utilities.capitalizeFirstLetter(handle)}*:` :
    `*${review.store_title}* removed their ${review.sentiment} review for ${Utilities.capitalizeFirstLetter(handle)}:`;

  const messageDescription = review.description;

  if (brand_id === 1) {
    sendMessage(messageHeading, `${process.env.SLACK_URL}`, messageDescription);
  } else {
    if (review.sentiment === 'negative' || review.sentiment === 'neutral') {
      sendMessage(messageHeading, `${process.env.OOTS_MERCHANT_ADVOCATES_URL}`, messageDescription);
      sendMessage(messageHeading, `${process.env.OOTS_SUPPORT_URL}`, messageDescription);
    } else {
      sendMessage(messageHeading, `${process.env.OOTS_SUPPORT_URL}`, messageDescription);
    }
  }
}

function sendMessage(message, url, description) {
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
            "text": `${message}`
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
            "text": `> ${description}`
          }
        }
      ]
    }
  }
  axios(options)
    .then(() => console.log(`Successfully submitted to Slack`))
    .catch(error => console.log(error));
}

module.exports = pingSlack;
