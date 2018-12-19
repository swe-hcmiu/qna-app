/* eslint-disable */
exports.seed = async function(knex, Promise) {
  // Deletes ALL questions existing entries
  await knex('questions').del();

  // session 1
  await knex('questions').insert({
    question_id: 1,
    session_id: 1,
    user_id: 1,
    title: 'blablablabla',
    content: 'blablablabla',
    vote_by_user: 2,
    vote_by_editor: 1,
    question_status: 'unanswered'
  });

  await knex('questions').insert({
    question_id: 2,
    session_id: 1,
    user_id: 3,
    title: 'blablablabla',
    content: 'blablablabla',
    vote_by_user: 0,
    vote_by_editor: 2,
    question_status: 'pending'
  });

  await knex('questions').insert({
    question_id: 3,
    session_id: 1,
    user_id: 3,
    title: 'blablablabla',
    content: 'blablablabla',
    vote_by_user: 0,
    vote_by_editor: 0,
    question_status: 'invalid'
  });

  await knex('questions').insert({
    question_id: 4,
    session_id: 1,
    user_id: 3,
    title: 'blablablabla',
    content: 'blablablabla',
    vote_by_user: 3,
    vote_by_editor: 0,
    question_status: 'unanswered'
  });

  await knex('questions').insert({
    question_id: 5,
    session_id: 1,
    user_id: 5,
    title: 'blablablabla',
    content: 'blablablabla',
    vote_by_user: 0,
    vote_by_editor: 1,
    question_status: 'answered'
  });

  // session 2
  await knex('questions').insert({
    question_id: 6,
    session_id: 2,
    user_id: 1,
    title: 'blablablabla',
    content: 'blablablabla',
    vote_by_user: 0,
    vote_by_editor: 1,
    question_status: 'unanswered'
  });

  await knex('questions').insert({
    question_id: 7,
    session_id: 2,
    user_id: 1,
    title: 'blablablabla',
    content: 'blablablabla',
    vote_by_user: 0,
    vote_by_editor: 0,
    question_status: 'answered'
  });

  await knex('questions').insert({
    question_id: 8,
    session_id: 2,
    user_id: 4,
    title: 'blablablabla',
    content: 'blablablabla',
    vote_by_user: 0,
    vote_by_editor: 0,
    question_status: 'invalid'
  });

  await knex('questions').insert({
    question_id: 9,
    session_id: 2,
    user_id: 5,
    title: 'blablablabla',
    content: 'blablablabla',
    vote_by_user: 1,
    vote_by_editor: 0,
    question_status: 'unanswered'
  });

  // session 3
  await knex('questions').insert({
    question_id: 10,
    session_id: 3,
    user_id: 5,
    title: 'blablablabla',
    content: 'blablablabla',
    vote_by_user: 0,
    vote_by_editor: 0,
    question_status: 'pending'
  });

  await knex('questions').insert({
    question_id: 11,
    session_id: 3,
    user_id: 1,
    title: 'blablablabla',
    content: 'blablablabla',
    vote_by_user: 0,
    vote_by_editor: 0,
    question_status: 'unanswered'
  });
};
