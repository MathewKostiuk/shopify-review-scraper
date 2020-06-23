
exports.up = function(knex) {
  return knex.schema
    .createTable('rankings', table => {
        table.increments('rankingId');
        table.integer('rank').unsigned();
        table.integer('themeId').unsigned().notNullable();
        table.string('themeHandle');
        table.date('date');
        table.foreign('themeId').references('themeId').inTable('themes');
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('rankings');
};
