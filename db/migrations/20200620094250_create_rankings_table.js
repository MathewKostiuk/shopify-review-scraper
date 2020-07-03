
exports.up = function(knex) {
  return knex.schema
    .createTable('rankings', table => {
        table.increments('id');
        table.integer('rank').unsigned();
        table.integer('theme').unsigned().notNullable();
        table.string('name');
        table.date('date');
        table.foreign('theme').references('themeId').inTable('themes');
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('rankings');
};
