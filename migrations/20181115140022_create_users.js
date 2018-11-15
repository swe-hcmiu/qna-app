exports.up = async (knex) => {
  await knex.schema
    .createTable('users', (table) => {
      table.increments('user_id');
      table.timestamps();

      table
        .string('display_name', 50)
        .notNullable();

      table
        .enu('provider', ['qna', 'google', 'anonymous'])
        .defaultTo('anonymous')
        .notNullable();
    })
    .createTable('qnausers', (table) => {
      table
        .string('username', 50)
        .notNullable();

      table.unique('username');

      table
        .string('userpass')
        .notNullable();

      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('user_id')
        .inTable('users')
        .onDelete('CASCADE');

      table.timestamps();
    })
    .createTable('googleusers', (table) => {
      table
        .string('email', 255)
        .notNullable();

      table.unique('email');

      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('user_id')
        .inTable('users')
        .onDelete('CASCADE');

      table.timestamps();
    });
};

exports.down = async (knex) => {
  await knex.schema
    .dropTable('qnausers')
    .dropTable('googleusers')
    .dropTable('users');
};
