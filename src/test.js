const { Session } = require('./sessions/Session');
const { Question } = require('./questions/Question');
const { Role } = require('./roles/Role');
const { Voting } = require('./votings/Voting');
const { User } = require('./users/User');
const { QnAUser } = require('./users/User');
const { assert } = require('chai');

async function runTest() {
  // const user = new User();
  // user.displayName = 'Duy Phan';
  // user.provider = 'qna';

  // user.qnaUsers = new QnAUser();
  // user.qnaUsers.username = 'duyphan123';
  // user.qnaUsers.userpass = '123';

  // await User.query().insertGraph(user);
  

runTest().then(() => { });

