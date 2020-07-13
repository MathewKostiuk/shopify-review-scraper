
exports.up = function(knex) {
  return knex.schema
    .createTable('percentPositive', table => {
      table.increments('id');
      table.integer('percentPositive').unsigned();
      table.string('name');
      table.integer('theme').unsigned().notNullable();
      table.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6));
      table.foreign('theme').references('theme_id').inTable('themes');
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('percentPositive');
};
