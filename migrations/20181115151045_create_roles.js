exports.up = async (knex) => {
  await knex.schema.createTable('roles', (table) => {
    table.timestamps(true, true);

    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('user_id')
      .inTable('users')
      .onDelete('CASCADE');

    table
      .integer('session_id')
      .unsigned()
      .notNullable()
      .references('session_id')
      .inTable('sessions')
      .onDelete('CASCADE');

    table
      .enu('role', ['editor'])
      .notNullable();

    table.primary(['user_id', 'session_id', 'role']);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('roles');
};
