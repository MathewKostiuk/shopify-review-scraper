const axios = require('axios');
const Utilities = require('../core/utilities');
const Channels = require('../db/models/channels');

async function pingSlack(review, brand_id, handle) {
  const { store_title: title, sentiment, description } = review;
  const messageHeading = `*${title}* left a new ${sentiment} review for *${Utilities.capitalizeFirstLetter(handle)}*:`;
  const channels = await findChannels(brand_id);

  for (let i = 0; i < channels.length; i++) {
    sendMessage(messageHeading, channels[i].url, description);
  }
}

async function findChannels(brand_id) {
  return await Channels.getChannelsByBrandId(brand_id);
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
