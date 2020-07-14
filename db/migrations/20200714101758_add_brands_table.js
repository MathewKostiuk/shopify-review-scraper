
exports.up = function(knex) {
  return knex.schema
    .createTable('brands', table => {
      table.increments('brand_id');
      table.string('brand', 25);
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('brands');
};
