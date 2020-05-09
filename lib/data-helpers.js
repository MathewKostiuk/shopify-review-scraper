// Help with reading/writing to/from the psql db
const db = require('../data/db');

const getAllThemes = async() => {
  return await db('themes');
}

const saveReview = (review) => {
  db('reviews').insert(review).then(() => console.log('done'));
}

const getReviews = async (theme) => {
  return await db('reviews').where('themeId', theme.themeId);
}

module.exports = { getAllThemes, saveReview, getReviews }
