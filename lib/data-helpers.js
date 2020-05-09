// Help with reading/writing to/from the psql db
const db = require('../data/db');

const getAllThemes = async() => {
  return await db('themes');
}

const saveReview = (review) => {
  db('reviews').insert(review).then(() => console.log('done'));
}

module.exports = { getAllThemes, saveReview }
