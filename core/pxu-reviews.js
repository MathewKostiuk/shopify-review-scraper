const ReviewsScraper = require('./reviews-scraper');

class PXUReviews extends ReviewsScraper {
  constructor(brand_id) {
    super(brand_id)
  }
}

module.exports = PXUReviews;
