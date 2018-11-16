/* eslint-disable */
exports.seed = async function(knex, Promise) {
  // Deletes ALL roles existing entries
  await knex('roles').del();

  await knex('roles').insert({
    user_id: 1,
    session_id: 1,
    role: 'editor'
  });

  await knex('roles').insert({
    user_id: 4,
    session_id: 1,
    role: 'editor'
  });

  await knex('roles').insert({
    user_id: 3,
    session_id: 2,
    role: 'editor'
  });

  await knex('roles').insert({
    user_id: 1,
    session_id: 3,
    role: 'editor'
  });

  await knex('roles').insert({
    user_id: 2,
    session_id: 3,
    role: 'editor'
  });

  await knex('roles').insert({
    user_id: 4,
    session_id: 3,
    role: 'editor'
  });
};
