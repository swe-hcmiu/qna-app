const { transaction } = require('objection');
const _ = require('lodash');

const { Role } = require('./Role');
const { Question } = require('../questions/Question');
const { User } = require('../users/User');
const { Voting } = require('../votings/Voting');
const { Model } = require('../../config/mysql/mysql-config');

class EditorSessionStrategy {
  async getInvalidQuestionsOfSession(session) {
    try {
      const listOfInvalidQuestions = await session
        .$relatedQuery('questions')
        .where({
          questionStatus: 'invalid',
        })
        .orderBy('updatedAt', 'desc');
      return listOfInvalidQuestions;
    } catch (err) {
      throw err;
    }
  }

  async getPendingQuestionsOfSession(session) {
    try {
      const listOfPendingQuestions = await session
        .$relatedQuery('questions')
        .where({
          questionStatus: 'pending',
        })
        .orderBy('updatedAt', 'desc');
      return listOfPendingQuestions;
    } catch (err) {
      throw err;
    }
  }

  async addQuestionToSession(question, session, user) {
    try {
      const inputQuestion = _.cloneDeep(question);

      inputQuestion.sessionId = session.sessionId;
      inputQuestion.userId = user.userId;
      inputQuestion.questionStatus = 'unanswered';
      const recvQuestion = await Question.query().insertAndFetch(inputQuestion);

      return recvQuestion;
    } catch (err) {
      throw err;
    }
  }

  async addVoteToQuestion(question, user) {
    try {
      const inputQuestion = _.cloneDeep(question);

      const recvQuestion = await transaction(Question.knex(), async (trx) => {
        const updatedQuestion = await inputQuestion
          .$query(trx)
          .updateAndFetch({ voteByEditor: inputQuestion.voteByEditor + 1 });

        await user.$relatedQuery('votings', trx).insert({ questionId: inputQuestion.questionId });
        return updatedQuestion;
      });

      return recvQuestion;
    } catch (err) {
      throw (err);
    }
  }

  async cancelVoteInQuestion(question, user) {
    try {
      const inputQuestion = _.cloneDeep(question);

      const recvQuestion = await transaction(Model.knex(), async (trx) => {
        let updatedQuestion = null;

        const votings = await user
          .$relatedQuery('votings')
          .where({
            questionId: inputQuestion.questionId,
          });

        if (votings[0]) {
          updatedQuestion = await inputQuestion
            .$query(trx)
            .updateAndFetch({ voteByEditor: inputQuestion.voteByEditor - 1 });
          await user
            .$relatedQuery('votings', trx)
            .delete()
            .where({ questionId: inputQuestion.questionId });
        }

        return updatedQuestion;
      });

      return recvQuestion;
    } catch (err) {
      throw (err);
    }
  }

  async updateQuestionStatus(question, status, user) {
    try {
      const updateQuestion = await question
      .$query()
      .updateAndFetch({questionStatus: status});
      return updateQuestion;
    } catch (err) {
      throw err;
    }
  }

  async addEditorToSession(editor, session) {
    try {
      const assignedEditor = _.cloneDeep(editor);

      await assignedEditor
        .$relatedQuery('roles')
        .insert({ sessionId: session.sessionId, role: 'editor' });
      return assignedEditor;
    } catch (err) {
      throw err;
    }
  }

  async removeEditorFromSession(editor, session) {
    try {
      const removedEditor = _.cloneDeep(editor);
      await removedEditor.$relatedQuery('roles').delete().where(session);

      return removedEditor;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = {
  EditorSessionStrategy,
};
