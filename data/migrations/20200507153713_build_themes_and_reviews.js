
exports.up = knex => {
  return knex.schema
    .createTable('themes', table => {
      table.increments('themeId');
      table.string('name', 30);
    })
    .createTable('reviews', table => {
      table.increments('reviewId');
      table.string('themeTitle', 20);
      table.string('storeTitle', 40);
      table.string('description', 1000);
      table.string('sentiment', 10);
      table.date('date');
    })
};

exports.down = knex => {
  return knex.schema
    .dropTable('reviews')
    .dropTable('themes');
};
