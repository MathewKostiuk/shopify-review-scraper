const ReviewsScraper = require('./reviews');

class PXUReviews extends ReviewsScraper {
  constructor(brand_id) {
    super(brand_id)
  }
}

module.exports = PXUReviews;
