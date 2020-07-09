
exports.up = function(knex) {
  return knex.schema
    .createTable('rankings', table => {
        table.increments('id');
        table.integer('rank').unsigned();
        table.integer('themeId').unsigned().notNullable();
        table.string('theme');
        table.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6));
        table.foreign('themeId').references('themeId').inTable('themes');
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('rankings');
};
