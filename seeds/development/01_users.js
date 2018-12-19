/* eslint-disable */
exports.seed = async function(knex, Promise) {
  // Deletes ALL users existing entries
  await knex('users').del();
  
  await knex('users').insert({
    user_id: 1,
    display_name: 'Todd Haydel',
    provider: 'qna'
  })
  
  await knex('users').insert({
    user_id: 2,
    display_name: 'Hana Willie',
    provider: 'qna'
  });

  await knex('users').insert({
    user_id: 3,
    display_name: 'Marvin Duffy',
    provider: 'anonymous'
  });

  await knex('users').insert({
    user_id: 4,
    display_name: 'Jaylen Cordova',
    provider: 'google'
  });

  await knex('users').insert({
    user_id: 5,
    display_name: 'Karen Joyce',
    provider: 'google'
  });

  // Deletes ALL qnausers existing entries
  await knex('qnausers').del();

  await knex('qnausers').insert({
    user_id: 1,
    username: 'todd_haydel',
    userpass: 'todd123'
  });

  await knex('qnausers').insert({
    user_id: 2,
    username: 'hana_willie',
    userpass: 'hana456'
  });

  // Deletes ALL googleusers existing entries
  await knex('googleusers').del();

  await knex('googleusers').insert({
    user_id: 4,
    email: 'jaylencordova@gmail.com'
  });

  await knex('googleusers').insert({
    user_id: 5,
    email: 'karenjoyce@gmail.com'
  });
};
