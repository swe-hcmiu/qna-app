const { Session } = require('./sessions/Session');
const { Question } = require('./questions/Question');
const { Role } = require('./roles/Role');
const { Voting } = require('./votings/Voting');
const { User } = require('./users/User');

async function runTest() {
  const sessions = await Session.query().where({ sessionId: 1 });
  const session = sessions[0];
  await session.$relatedQuery('questionUsers');
  console.log(session.questionUsers);
}

runTest().then(() => { });
