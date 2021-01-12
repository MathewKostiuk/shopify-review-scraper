const ReviewsScraper = require('./reviews-scraper');

class OOTSReviewsScraper extends ReviewsScraper {
  constructor(brand_id) {
    super(brand_id);
  }
}

module.exports = OOTSReviewsScraper;
