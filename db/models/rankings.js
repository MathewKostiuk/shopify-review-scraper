const db = require('../index');

class Rankings {
  static async save(rank) {
    try {
      return await db('rankings').insert(rank);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Rankings;
