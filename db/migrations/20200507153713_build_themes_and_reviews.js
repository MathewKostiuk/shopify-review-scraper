
exports.up = knex => {
  return knex.schema
    .createTable('themes', table => {
      table.increments('themeId');
      table.string('name', 30);
      table.string('url', 75);
    })
    .createTable('reviews', table => {
      table.increments('reviewId');
      table.integer('themeId').unsigned().notNullable();
      table.string('themeTitle', 20);
      table.string('storeTitle', 150);
      table.string('description', 1000);
      table.string('sentiment', 10);
      table.date('date');
      table.foreign('themeId').references('themeId').inTable('themes');
    })
};

exports.down = knex => {
  return knex.schema
    .dropTable('reviews')
    .dropTable('themes');
};
