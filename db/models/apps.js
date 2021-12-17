const db = require('../index');

class Apps {
  static async getAllApps() {
    try {
      return await db('apps');
    } catch (error) {
      console.log(error);
    }
  }

  static async getAppsByBrandId(brand_id) {
    try {
      return await db('apps').where('brand_id', brand_id);
    } catch (error) {
      console.log(error);
    }
  }

  static async getAppByID(id) {
    try {
      return await db('apps').where('id', id);
    } catch (error) {
      console.log(error);
    }
  }

  static async getAppByHandle(handle) {
    try {
      return await db('apps').where('handle', handle);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Apps;
