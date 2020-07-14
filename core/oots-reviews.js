const Reviews = require('./reviews');

class OOTSReviewsScraper extends Reviews {
  constructor(brand_id) {
    super(brand_id);
  }
}

module.exports = OOTSReviewsScraper;
