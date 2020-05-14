// Help with reading/writing to/from the psql db
const db = require('../data/db');

const getAllThemes = async () => {
  return await db('themes');
}

const saveReview = async (review) => {
  try {
    return await db('reviews').insert(review, ['storeTitle', 'themeTitle', 'sentiment', 'description', 'date']);
  } catch (error) {
    console.log(error);
  }
}

const getReviews = async (theme) => {
  return await db('reviews').where('themeTitle', theme);
}

const checkIfReviewExists = async review => {
  const reviewInDB = await db('reviews').where({
    storeTitle: review.storeTitle,
    themeTitle: review.themeTitle,
    description: review.description,
    sentiment: review.sentiment
  });
  return reviewInDB;
}

module.exports = { getAllThemes, saveReview, getReviews, checkIfReviewExists }
