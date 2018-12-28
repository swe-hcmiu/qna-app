const CanCan = require('cancan');
const _ = require('lodash');

const cancan = new CanCan();
const { allow, can } = cancan;
const { User } = require('../../src/users/User');
const { Session } = require('../../src/sessions/Session');
const { Question } = require('../../src/questions/Question');
const { Role } = require('../../src/roles/Role');

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

allow(Role, 'delete', Session, (role, session) => {
  return (role.sessionId === session.sessionId) && (role.role === 'editor');
});

allow(Role, 'update', Session, (role, session) => {
  return (role.sessionId === session.sessionId) && (role.role === 'editor');
});

allow(Role, 'update', Question, (role, question) => {
  return (role.sessionId === question.sessionId) && (role.role === 'editor');
});

allow(Role, 'add', User, (role, user) => {
  return (role.role === 'editor') && (_.isEmpty(user.roles));
});

allow(Role, 'remove', Role, (role, removedRole) => {
  return (role.sessionId === removedRole.sessionId) && (role.role === 'editor') && (removedRole.role === 'editor');
});

module.exports = { can };
