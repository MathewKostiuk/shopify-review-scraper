const db = require('../index');

class PercentPositive {
  static async save(percentage) {
    try {
      return await db('percent_positive').insert(percentage);      
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = PercentPositive;
