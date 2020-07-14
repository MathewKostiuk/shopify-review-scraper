
exports.up = function(knex) {
  return knex.schema
    .alterTable('themes', table => {
      table.integer('brand_id').unsigned().notNullable();
      table.foreign('brand_id').references('brand_id').inTable('brands');
    });
};

exports.down = function(knex) {
  return knex.schema
    .alterTable('themes', table => {
      table.dropForeign('brand_id');
    })
};
