const db = require('../index');

class Channels {
  static async getChannels() {
    try {
      return await db('channels');
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async getChannelById(id) {
    try {
      return await db('channels').where({ id });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async createChannel(channel) {
    try {
      return await db('channels').insert(channel);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async deleteChannel(id) {
    try {
      return await db('channels').where({ id }).del();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async getChannelsByBrandId(brandId) {
    try {
      return await db('channels').where('brand_id', brandId);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = Channels;
