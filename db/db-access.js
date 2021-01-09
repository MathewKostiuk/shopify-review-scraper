// Help with reading/writing to/from the psql db
const db = require('./index');

 class DBAccess {
  static async getAllThemes() {
    try {
      return await db('themes');   
    } catch (error) {
      console.log(error);
    }
  }
  
  static async getThemesByBrandId(brand_id) {
    try {
      return await db('themes').where('brand_id', brand_id);   
    } catch (error) {
      console.log(error);
    }
  }

  static async getThemeByID(theme_id) {
    try {
      return await db('themes').where('theme_id', theme_id);
    } catch (error) {
      console.log(error);
    }
  }

  static async getThemeByHandle(handle) {
    try {
      return await db('themes').where('handle', handle);
    } catch (error) {
      console.log(error);
    }
  }

  static async saveReview(review) {
    try {
      return await db('reviews').insert(review);
    } catch (error) {
      console.log(error);
    }
  }
  
  static async deleteReview(review) {
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
  
  static async getReviews(theme_id) {
    try {
      const reviews = await db('reviews').where('theme_id', theme_id);
      return reviews;
    } catch (error) {
      console.log(error);
    }
  }
  
  static async insertRankings(rank) {
    try {
      return await db('rankings').insert(rank);
    } catch (error) {
      console.log(error);
    }
  }

  static async savePercentage(percentage) {
    try {
      return await db('percent_positive').insert(percentage);      
    } catch (error) {
      console.log(error)
    }
  }

  static async getBrandId(brand) {
    try {
      return await db('brands').where('brand', brand);
    } catch (error) {
      console.log(error)
    }
  }
}



module.exports = DBAccess;
