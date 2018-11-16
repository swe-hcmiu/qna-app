/* eslint-disable */
exports.seed = async function (knex, Promise) {
  // Deletes ALL votings existing entries
  await knex('votings').del();

  // question 1
  await knex('votings').insert({
    user_id: 2,
    question_id: 1
  });

  await knex('votings').insert({
    user_id: 5,
    question_id: 1
  });

  await knex('votings').insert({
    user_id: 1,
    question_id: 1
  });

  // question 2
  await knex('votings').insert({
    user_id: 1,
    question_id: 2
  });

  await knex('votings').insert({
    user_id: 4,
    question_id: 2
  });

  // question 4
  await knex('votings').insert({
    user_id: 2,
    question_id: 4
  });

  await knex('votings').insert({
    user_id: 3,
    question_id: 4
  });

  await knex('votings').insert({
    user_id: 5,
    question_id: 4
  });

  // question 5
  await knex('votings').insert({
    user_id: 1,
    question_id: 5
  });

  // question 6
  await knex('votings').insert({
    user_id: 3,
    question_id: 6
  });

  // question 9
  await knex('votings').insert({
    user_id: 4,
    question_id: 9
  });
};
