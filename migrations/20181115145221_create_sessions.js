exports.up = async (knex) => {
  await knex.schema.createTable('sessions', (table) => {
    table.increments('session_id');
    table.timestamps(true, true);

    table
      .string('session_name', 70)
      .notNullable();

    table
      .enu('session_type', ['default', 'needs_verification'])
      .defaultTo('default')
      .notNullable();

    table
      .enu('session_status', ['opening', 'closed'])
      .defaultTo('opening')
      .notNullable();
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('sessions');
};
