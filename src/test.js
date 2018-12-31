const moment = require('moment');
const { Session } = require('./sessions/Session');
const { Question } = require('./questions/Question');
const { Role } = require('./roles/Role');
const { Voting } = require('./votings/Voting');
const { User } = require('./users/User');
const { QnAUser } = require('./users/User');
const { assert } = require('chai');
const { getVotingList } = require('./sessions/SessionService');
const { getQuestionList } = require('./sessions/SessionService');
const { knex } = require('../config/mysql/mysql-config');
const appConfig = require('../config/app/app-config');
const _ = require('lodash');

function getUniqueQuestionIdList(...args) {
  const listOfQuestionId = args.reduce((cumList, curList) => {
    return cumList.concat(_.uniq(curList.map((element) => {
      return element.questionId;
    })).filter((questionId) => {
      return cumList.indexOf(questionId) === -1;
    }));
  }, []);

  return listOfQuestionId;
}

function getUniqueQuestionList(...args) {
  const listOfQuestionId = args.reduce((cumList, curList) => {
    return cumList.concat(_.uniqBy(curList, 'questionId').filter((element) => {
      return !_.find(cumList, { questionId: element.questionId });
    }));
  }, []);

  return listOfQuestionId;
}

async function runTest() {
  const question = {
    title: 'b',
    content: 'd',
    userId: 6,
    sessionId: 7,
    questionStatus: 'unanswered',
  };
  await Question.query().insertAndFetch(question);
  // const sessions = await Session.query().where({ sessionId: 1 });

  // const listOfNewestQuestions = await sessions[0]
  //   .$relatedQuery('questions')
  //   .where('uuid', '<', appConfig.defaultCursor)
  //   .orderBy('uuid', 'desc');

  // console.log(listOfNewestQuestions);
  // const listOfNewestQuestionsId = listOfNewestQuestions.map((element) => {
  //   return element.questionId;
  // });
  // console.log(listOfNewestQuestionsId);
  // const listOfVotingQuestions = await Voting.query().where('userId', 2).andWhere('questionId', 'in', listOfNewestQuestionsId);
  // console.log(listOfVotingQuestions);
  // const listOfQuestionId = getUniqueQuestionIdList([
  //   {
  //     questionId: 1,
  //     title: 'blablabla',
  //     content: 'blablbal',
  //   },
  //   {
  //     questionId: 2,
  //     title: 'question 2',
  //     voteByUser: 7,
  //   },
  //   {
  //     questionId: 3,
  //     title: 'question 3',
  //     voteByUser: 8
  //   },
  //   {
  //     questionId: 2,
  //     title: 'question 2',
  //     voteByUser: 7,
  //   },
  //   {
  //     questionId: 3,
  //     title: 'question 3',
  //   },
  // ], [
  //   {
  //     questionId: 4,
  //     title: 'question 4'
  //   },
  //   {
  //     questionId: 5,
  //     title: 'question 5'
  //   },
  //   {
  //     questionId: 1,
  //     title: 'blablbal',
  //   },
  //   {
  //     questionId: 3,
  //     title: 3,
  //   },
  //   {
  //     questionId: 5,
  //     title: 'question 5',
  //   },
  // ], [
  //   {
  //     questionId: 6,
  //     title: 'balblaba',
  //   },
  //   {
  //     questionId: 4,
  //     title: 'blablabla',
  //   },
  //   {
  //     questionId: 1,
  //     title: 'lblaadfasd',
  //   },
  // ]);
  // console.log(listOfQuestionId);

  // const listOfQuestion = getUniqueQuestionList([
  //   {
  //     questionId: 1,
  //     title: 'blablabla',
  //     content: 'blablbal',
  //   },
  //   {
  //     questionId: 2,
  //     title: 'question 2',
  //     voteByUser: 7,
  //   },
  //   {
  //     questionId: 3,
  //     title: 'question 3',
  //     voteByUser: 8
  //   },
  //   {
  //     questionId: 2,
  //     title: 'question 2',
  //     voteByUser: 7,
  //   },
  //   {
  //     questionId: 3,
  //     title: 'question 3',
  //   },
  // ], [
  //   {
  //     questionId: 4,
  //     title: 'question 4'
  //   },
  //   {
  //     questionId: 5,
  //     title: 'question 5'
  //   },
  //   {
  //     questionId: 1,
  //     title: 'blablbal',
  //   },
  //   {
  //     questionId: 3,
  //     title: 3,
  //   },
  //   {
  //     questionId: 5,
  //     title: 'question 5',
  //   },
  // ], [
  //   {
  //     questionId: 6,
  //     title: 'balblaba',
  //   },
  //   {
  //     questionId: 4,
  //     title: 'blablabla',
  //   },
  //   {
  //     questionId: 1,
  //     title: 'lblaadfasd',
  //   },
  // ]);
  // console.log(listOfQuestion);
}

runTest().then(() => { });

// async function getVotingList(session, user) {
//   try {
//     const result = await User
//       .query()
//       .joinEager()
//       .eager('votings.questions')
//       .modifyEager('votings', (builder) => {
//         builder.select('questionId');
//       })
//       .modifyEager('votings.questions', (builder) => {
//         builder.select('questionId', 'sessionId');
//       })
//       .where('users.userId', user.userId)
//       .andWhere('votings:questions.sessionId', session.sessionId);

//     if (_.isEmpty(result)) return [];

//     const votingList = result[0].votings.map((element) => {
//       return {
//         questionId: element.questionId,
//       };
//     });
//     return votingList;
//   } catch (err) {
//     throw err;
//   }
// }

// async function getQuestionList(session, user) {
//   try {
//     const result = await user
//       .$relatedQuery('questions')
//       .where({ sessionId: session.sessionId })
//       .select('questionId');

//     const questionList = result.map((element) => {
//       return {
//         questionId: element.questionId,
//       };
//     });
//     return questionList;
//   } catch (err) {
//     throw err;
//   }
// }
