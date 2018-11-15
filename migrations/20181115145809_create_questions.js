exports.up = async (knex) => {
  await knex.schema.createTable('questions', (table) => {
    table.increments('question_id');
    table.timestamps();

    table
      .integer('session_id')
      .unsigned()
      .notNullable()
      .references('session_id')
      .inTable('sessions')
      .onDelete('CASCADE');

    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('user_id')
      .inTable('users')
      .onDelete('CASCADE');

    table
      .string('title', 255)
      .notNullable();

    table
      .text('content', 'mediumtext');

    table
      .integer('vote_by_user')
      .defaultTo(0);

    table
      .integer('vote_by_editor')
      .defaultTo(0);

    table
      .enu('question_status', ['pending', 'unanswered', 'answered', 'invalid'])
      .defaultTo(null);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('questions');
};
