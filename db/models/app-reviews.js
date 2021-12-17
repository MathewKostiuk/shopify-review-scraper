const db = require('../index');

class Reviews {
  static async getAllById(id) {
    try {
      const reviews = await db('app_reviews').where('app_id', id);
      return reviews;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async getFirstReviewById(id) {
    try {
      const reviews = await db('app_reviews').where('app_id', id);
      return reviews[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async save(review) {
    console.log(review);
    try {
      return await db('app_reviews').insert(review);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async delete(review) {
    try {
      return await db('app_reviews').where({
        store_title: review.store_title,
        app_id: review.app_id,
        sentiment: review.sentiment,
        description: review.description
      })
      .del();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async exists(review) {
    let result;
    try {
      result = await db('app_reviews').where({
        store_title: review.store_title,
        sentiment: review.sentiment,
        description: review.description
      })
    } catch (error) {
      console.log(error);
      throw error;
    }
    return result.length > 0;
  }

  static async appReviewsEmpty(id) {
    let result;
    try {
      result = await db('app_reviews').where('app_id', id);
    } catch (error) {
      console.log(error);
      throw error;
    }
    return result.length === 0;
  }
}

module.exports = Reviews;
