
exports.up = function(knex, Promise) {
  return knex.schema.createTable('facebook_actions', (table) => {
    table.increments('id').primary();
    table.boolean('enabled');
    table.string('title');
    table.text('description', 'longtext');
    table.string('target');
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('facebook_actions');
};
