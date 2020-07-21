
exports.up = knex => knex.schema.alterTable('percent_positive', table => {
  table.renameColumn('theme', 'theme_id');
});

exports.down = knex => knex.schema.alterTable('percent_positive', table => {
  table.renameColumn('theme_id', 'theme');
});
