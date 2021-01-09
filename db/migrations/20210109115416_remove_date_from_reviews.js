
exports.up = knex => knex.schema.alterTable('reviews', table => {
  table.dropColumn('date');
});

exports.down = knex => knex.schema.alterTable('reviews', table => {
  table.date('date');
});
