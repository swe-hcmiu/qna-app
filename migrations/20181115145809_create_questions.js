exports.up = async (knex) => {
  await knex.schema.createTable('questions', (table) => {
    table.increments('question_id');
    table.timestamps(true, true);

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

    table
      .bigInteger('uuid')
      .unsigned();
  });

  await knex.raw(`
      create trigger before_question_insert
      before insert on questions
        for each row 
        set new.uuid = uuid_short();
      `);

  await knex.raw(`
      create trigger before_question_update
      before update on questions
        for each row 
        begin
          if new.question_status <> old.question_status then set new.uuid = uuid_short();
          end if;
        end
      `);
};

exports.down = async (knex) => {
  await knex.schema.dropTable('questions');
};
