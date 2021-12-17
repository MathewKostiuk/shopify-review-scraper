
exports.up = function(knex) {
  return knex.schema
    .createTable('apps', table => {
      table.increments('id');
      table.string('handle');
      table.string('url');
      table.integer('brand_id').unsigned().notNullable();
      table.foreign('brand_id').references('brand_id').inTable('brands');
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable('apps');
};
