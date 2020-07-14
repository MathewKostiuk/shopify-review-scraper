
exports.up = function(knex) {
  return knex.schema
    .alterTable('reviews', table => {
      table.dropColumn('handle');
    })
    .alterTable('rankings', table => {
      table.dropColumn('theme');
    })
    .alterTable('percent_positive', table => {
      table.dropColumn('name');
    })
};

exports.down = function(knex) {
  return knex.schema
  .alterTable('reviews', table => {
    table.string('handle', 20);
  })
  .alterTable('rankings', table => {
    table.string('theme');
  })
  .alterTable('percent_positive', table => {
    table.string('name');
  })
};
