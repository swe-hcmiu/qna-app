exports.up = async (knex) => {
  await knex.schema.createTable('votings', (table) => {
    table.timestamps(true, true);

    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('user_id')
      .inTable('users')
      .onDelete('CASCADE');

    table
      .integer('question_id')
      .unsigned()
      .notNullable()
      .references('question_id')
      .inTable('questions')
      .onDelete('CASCADE');

    table.primary(['user_id', 'question_id']);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('votings');
};
