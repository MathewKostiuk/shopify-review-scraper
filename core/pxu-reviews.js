const Reviews = require('./reviews');

class PXUReviews extends Reviews {
  constructor(brand_id) {
    super(brand_id)
  }
}

module.exports = PXUReviews;
