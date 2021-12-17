
exports.up = function(knex) {
  return knex.schema
    .createTable('app_reviews', table => {
      table.increments('id');
      table.integer('app_id').unsigned().notNullable();
      table.string('store_title', 250);
      table.string('description', 1000);
      table.string('sentiment');
      table.foreign('app_id').references('id').inTable('apps');
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable('app_reviews');
};
