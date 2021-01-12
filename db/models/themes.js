const db = require('../index');

class Themes {
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
}

module.exports = Themes;
