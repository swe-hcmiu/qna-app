const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const UserService = require('../services/UserService');
const ValidateSessionHandler = require('../validator/session');
const SessionService = require('../services/SessionService');
const EditorSessionService = require('../services/EditorSessionService');

function getUserInfo(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, keys.secretOrKey, (err, decoded) => {
      if (err) return reject(err);
      return resolve(decoded);
    });
  });
}

async function processUserInfo(data, socket) {
  let user = {};
  try {
    user = await getUserInfo(data.token);
  } catch (err) {
    const userId = await UserService.createAnonymousUser();
    const payload = { userId };
    const newToken = jwt.sign(payload, keys.secretOrKey, {
      expiresIn: '7d',
    });
    user = await getUserInfo(newToken);

    socket.emit('receive_token', newToken);
  }
  return user;
}

function getRoomInfo(socket) {
  const rooms = Object.keys(socket.rooms);
  if (rooms.length > 1) {
    const arr = rooms[1].split('_');
    return {
      room: rooms[1],
      sessionId: arr[1],
    };
  }
  return null;
}

module.exports = (io) => {
  const sessionChannel = io.of('/session');

  sessionChannel.on('connection', (socket) => {
    socket.on('create_session', async (data) => {
      try {
        const user = await processUserInfo(data, socket);

        const validateObj = Object.assign(data, { user });
        await ValidateSessionHandler.validateCreateSessionInput(validateObj);
        let session = {
          sessionName: data.sessionName,
          sessionType: data.sessionType,
        };

        const sessionId = await EditorSessionService.createSession(user.userId, session);
        session = Object.assign(session, sessionId);

        sessionChannel.emit('new_session_created', session);
      } catch (err) {
        socket.emit('error', err);
      }
    });

    socket.on('join_room', async (data) => {
      try {
        const user = await processUserInfo(data, socket);
        await ValidateSessionHandler.validateSession(data.sessionId);
        socket.join(`room_${data.sessionId}`, () => {
          socket.to(`room_${data.sessionId}`).emit('new_user_entered', user);
        });
      } catch (err) {
        socket.emit('error', err);
      }
    });

    socket.on('disconnecting', () => {
      const rooms = Object.keys(socket.rooms);
      if (rooms.length > 1) {
        socket.leave(rooms[1], (err) => {
          if (err) return socket.emit('error', err);
          return socket.to(rooms[1]).emit('user_leave_room');
        });
      }
    });

    socket.on('create_question', async (data) => {
      try {
        const user = await processUserInfo(data, socket);
        const roomInfo = getRoomInfo(socket);
        const { room } = roomInfo;
        const { sessionId } = roomInfo;
        const validateObj = Object.assign(data, { sessionId });
        await ValidateSessionHandler.validateUserAddQuestions(validateObj);

        let question = {
          title: data.title,
          content: data.content,
        };
        const questionId = await SessionService.addQuestionByRole(sessionId, user.userId, question);
        const listOfFavoriteQuestions = await SessionService.getTopFavoriteQuestionsOfSession(sessionId);
        question = Object.assign(question, questionId);
        sessionChannel.to(room).emit('new_question_created', question);
        sessionChannel.to(room).emit('question_top10_changed', {
          listOfFavoriteQuestions,
        });
      } catch (err) {
        socket.emit('error', err);
      }
    });

    socket.on('create_vote', async (data) => {
      try {
        const user = await processUserInfo(data, socket);
        const roomInfo = getRoomInfo(socket);
        const { room } = roomInfo;
        const { sessionId } = roomInfo;
        const roleObj = await UserService.getRoleOfUserInSession(user.userId, sessionId);
        const role = roleObj.Role;
        const validateObj = Object.assign(data, { sessionId, role });

        await ValidateSessionHandler.validateUserVoteQuestions(validateObj);
        await SessionService.addVoteByRole(sessionId, data.questionId, user.userId, role);

        const listOfFavoriteQuestions = await SessionService.getTopFavoriteQuestionsOfSession(sessionId);
        sessionChannel.to(room).emit('new_vote_created', {
          questionId: data.questionId,
        });
        sessionChannel.to(room).emit('question_top10_changed', {
          listOfFavoriteQuestions,
        });
      } catch (err) {
        socket.emit('error', err);
      }
    });

    socket.on('cancle_vote', async (data) => {
      try {
        const user = await processUserInfo(data, socket);
        const roomInfo = getRoomInfo(socket);
        const { room } = roomInfo;
        const { sessionId } = roomInfo;
        const roleObj = await UserService.getRoleOfUserInSession(user.userId, sessionId);
        const role = roleObj.Role;
        const validateObj = Object.assign(data, { sessionId });

        await ValidateSessionHandler.validateUserCancleVoteQuestions(validateObj);
        await SessionService.cancelVoteByRole(sessionId, data.questionId, user.userId, role);

        const listOfFavoriteQuestions = await SessionService.getTopFavoriteQuestionsOfSession(sessionId);
        
        sessionChannel.to(room).emit('new_vote_deleted', {
          questionId: data.questionId,
        });
        sessionChannel.to(room).emit('question_top10_changed', {
          listOfFavoriteQuestions,
        });
      } catch (err) {
        socket.emit('error', err);
      }
    });

    socket.on('change_question_status', async (data) => {
      try {
        const user = await processUserInfo(data, socket);
        const roomInfo = getRoomInfo(socket);
        const { room } = roomInfo;
        const { sessionId } = roomInfo;
        const roleObj = await UserService.getRoleOfUserInSession(user.userId, sessionId);
        const role = roleObj.Role;
        const validateObj = Object.assign(data, { sessionId, role });

        await ValidateSessionHandler.validateChangeQuestionStatus(validateObj);
        await EditorSessionService.updateQuestionStatus(data.questionId, data.status);

        const listOfFavoriteQuestions = await SessionService.getTopFavoriteQuestionsOfSession(sessionId);
        sessionChannel.to(room).emit('question_status_changed', {
          questionId: data.questionId,
          status: data.status,
        });
        sessionChannel.to(room).emit('question_top10_changed', {
          listOfFavoriteQuestions,
        });
      } catch (err) {
        socket.emit('error', err);
      }
    });
  });
};
