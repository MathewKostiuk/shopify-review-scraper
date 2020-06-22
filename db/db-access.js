// Help with reading/writing to/from the psql db
const db = require('./index');

 class DBAccess {
  static async getAllThemes() {
    return await db('themes');
  }
  
  static async saveReview(review) {
    try {
      return await db('reviews').insert(review, ['storeTitle', 'themeTitle', 'sentiment', 'description', 'date']);
    } catch (error) {
      console.log(error);
    }
  }
  
  static async deleteReview(review) {
    try {
      return await db('reviews').where({
        storeTitle: review.storeTitle,
        themeTitle: review.themeTitle,
        sentiment: review.sentiment,
        description: review.description
      })
      .del();
    } catch (error) {
      console.log(error);
    }
  }
  
  static async getReviews(theme) {
    try {
      const reviews = await db('reviews').where('themeTitle', theme).orderBy('date', 'desc');
      return reviews;
    } catch (error) {
      console.log(error);
    }
  }
  
  static async saveRanking(rank) {
    try {
      return await db('rankings').insert(rank);
    } catch (error) {
      console.log(error);
    }
  }
}



module.exports = DBAccess;
