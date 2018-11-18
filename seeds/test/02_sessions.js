/* eslint-disable */
exports.seed = async function(knex, Promise) {
  // Deletes ALL sessions existing entries
  await knex('sessions').del();

  await knex('sessions').insert({
    session_id: 1,
    session_name: 'OOP Class',
    session_type: 'default',
    session_status: 'opening'
  });

  await knex('sessions').insert({
    session_id: 2,
    session_name: 'Information Day',
    session_type: 'needs_verification',
    session_status: 'opening'
  });

  await knex('sessions').insert({
    session_id: 3,
    session_name: 'SE Lab Section',
    session_type: 'default',
    session_status: 'opening'
  });

  await knex('sessions').insert({
    session_id: 4,
    session_name: 'Database Lab Section',
    session_type: 'needs_verification',
    session_status: 'closed'
  });

  await knex('sessions').insert({
    session_id: 5,
    session_name: 'DarkNight Hackathon',
    session_type: 'needs_verification',
    session_status: 'closed'
  });
};
