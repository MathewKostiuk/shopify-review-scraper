
exports.up = function(knex) {
  return knex.schema
    .createTable('rankings', table => {
        table.increments('id');
        table.integer('rank').unsigned();
        table.integer('theme_id').unsigned().notNullable();
        table.string('theme');
        table.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6));
        table.foreign('theme_id').references('theme_id').inTable('themes');
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('rankings');
};
