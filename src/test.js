const { Session } = require('./sessions/Session');
const { Question } = require('./questions/Question');
const { Role } = require('./roles/Role');
const { Voting } = require('./votings/Voting');
const { User } = require('./users/User');
const { QnAUser } = require('./users/User');
const { assert } = require('chai');
const { getVotingList } = require('./sessions/SessionService');
const { getQuestionList } = require('./sessions/SessionService');

async function runTest() {
  const session = await Session.query().where('sessionId', 1);
  const user = await User.query().where('userId', 1);
  console.log(session);
  console.log(user);
  const result = await getVotingList(session[0], user[0]);
  const result2 = await getQuestionList(session[0], user[0]);
  console.log(result);
  console.log(result2);
}

runTest().then(() => { });
