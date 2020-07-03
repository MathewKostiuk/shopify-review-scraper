
exports.up = function(knex) {
  return knex.schema
    .createTable('percentPositive', table => {
      table.increments('id');
      table.integer('percentPositive').unsigned();
      table.string('name');
      table.integer('theme').unsigned().notNullable();
      table.date('date');
      table.foreign('theme').references('themeId').inTable('themes');
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('percentPositive');
};
