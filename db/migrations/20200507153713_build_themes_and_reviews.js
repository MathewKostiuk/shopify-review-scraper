
exports.up = knex => {
  return knex.schema
    .createTable('themes', table => {
      table.increments('theme_id');
      table.string('handle', 30);
      table.string('url', 75);
    })
    .createTable('reviews', table => {
      table.increments('reviewId');
      table.integer('theme_id').unsigned().notNullable();
      table.string('handle', 20);
      table.string('store_title', 150);
      table.string('description', 1000);
      table.string('sentiment', 10);
      table.date('date');
      table.foreign('theme_id').references('theme_id').inTable('themes');
    })
};

exports.down = knex => {
  return knex.schema
    .dropTable('reviews')
    .dropTable('themes');
};
