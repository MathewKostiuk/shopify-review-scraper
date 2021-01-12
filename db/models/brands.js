const db = require('../index');

class Brands {
  static async getId(brand) {
    try {
      return await db('brands').where('brand', brand);
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = Brands;
