const axios = require('axios');

function pingSlack(review, isNew) {
  const messageHeading = isNew ? `*${review.storeTitle}* left a new ${review.sentiment} review for *${Utilities.capitalizeFirstLetter(review.handle)}*:` :
    `*${review.storeTitle}* removed their ${review.sentiment} review for ${Utilities.capitalizeFirstLetter(review.handle)}:`;

  const options = {
    method: 'post',
    url: `${process.env.SLACK_URL}`,
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

module.exports = pingSlack;
