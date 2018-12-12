const CanCan = require('cancan');
const _ = require('lodash');

const cancan = new CanCan();
const { allow, can } = cancan;
const { User } = require('../../src/users/User');
const { Session } = require('../../src/sessions/Session');
const { Question } = require('../../src/questions/Question');
const { Voting } = require('../../src/votings/Voting');

allow(User, 'create', Session, (user) => {
  if (user) return true;
  return false;
});

allow(User, 'vote', Question, (user, question) => {
  if (_.find(user.votings, { questionId: question.questionId })) return false;
  return true;
});

allow(User, 'unvote', Question, (user, question) => {
  if (_.find(user.votings, { questionId: question.questionId })) return true;
  return false;
});

module.exports = { can };
