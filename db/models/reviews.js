const db = require('../index');

class Reviews {
  static async getAllByThemeId(themeId) {
    try {
      const reviews = await db('reviews').where('theme_id', themeId);
      return reviews;
    } catch (error) {
      console.log(error);
    }
  }

  static async save(review) {
    try {
      return await db('reviews').insert(review);
    } catch (error) {
      console.log(error);
    }
  }

  static async delete(review) {
    try {
      return await db('reviews').where({
        store_title: review.store_title,
        theme_id: review.theme_id,
        sentiment: review.sentiment,
        description: review.description
      })
      .del();
    } catch (error) {
      console.log(error);
    }
  }

  static async exists(review) {
    let review;
    try {
      review = await db('reviews').where({
        store_title: review.store_title,
        sentiment: review.sentiment
      })
    } catch (error) {
      console.log(error);
    }

    return review.length === 1;
  }
}

module.exports = Reviews;
