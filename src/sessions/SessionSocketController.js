const jwt = require('jsonwebtoken');

const keys = require('../../config/passport/keys');
const { UserService } = require('../users/UserService');
const { SessionService } = require('./SessionService');
const { Session } = require('./Session');
const { User } = require('../users/User');
const { AppError } = require('../errors/AppError');

function getUserInfo(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, keys.tokenSecret, (err, decoded) => {
      if (err) return reject(err);
      return resolve(decoded);
    });
  });
}

async function processUserInfo(data, socket) {
  let user = {};
  try {
    user = await getUserInfo(data.token);
    const recvUser = UserService.getUserById(user.userId);
    if (recvUser) return recvUser;
    throw new AppError('Not Found', 404);
  } catch (err) {
    const recvUser = await UserService.createAnonymousUser();
    user = JSON.parse(JSON.stringify(recvUser));
    const payload = user;
    const newToken = jwt.sign(payload, keys.tokenSecret, {
      expiresIn: '7d',
    });

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
    socket.on('get_session_list', async (data, callback) => {
      try {
        await processUserInfo(data, socket);
        const listOfSessions = await SessionService.getListOfSessions();
        callback(listOfSessions);
      } catch (err) {
        socket.emit('exception', err);
      }
    });

    socket.on('create_session', async (data) => {
      try {
        let user = await processUserInfo(data, socket);
        user = Object.assign(new User(), user);
        const session = Object.assign(new Session(), data.session);

        const recvSession = await SessionService.createSession(session, user);

        sessionChannel.emit('new_session_created', recvSession);
      } catch (err) {
        console.log(err);
        socket.emit('exception', err);
      }
    });

    socket.on('join_room', async (data) => {
      try {
        const user = await processUserInfo(data, socket);

        const session = await SessionService.getSessionInstance(data.sessionId);
        const service = await SessionService.getSessionService(session, user);

        socket.join(`room_${data.sessionId}`, () => {
          socket.to(`room_${data.sessionId}`).emit('new_user_entered', user);

          socket.user = user;

          if (service.role.role === 'editor') socket.role = 'editor';
          else socket.role = 'user';
        });
      } catch (err) {
        console.log(err);
        socket.emit('exception', err);
      }
    });

    socket.on('disconnecting', () => {
      const rooms = Object.keys(socket.rooms);
      if (rooms.length > 1) {
        socket.leave(rooms[1], (err) => {
          if (err) return socket.emit('exception', err);
          return socket.to(rooms[1]).emit('user_leave_room', socket.user);
        });
      }
    });

    socket.on('get_room_data', async (data, callback) => {
      try {
        const user = await processUserInfo(data, socket);

        const session = await SessionService.getSessionInstance(data.sessionId);
        const service = await SessionService.getSessionService(session, user);

        const roomData = await service.getInfoOfSession();
        callback(roomData);
      } catch (err) {
        socket.emit('exception', err);
      }
    });

    socket.on('create_question', async (data) => {
      try {
        const user = await processUserInfo(data, socket);
        const roomInfo = getRoomInfo(socket);
        const { room } = roomInfo;
        const { sessionId } = roomInfo;

        const { question } = data;

        const session = await SessionService.getSessionInstance(sessionId);
        const service = await SessionService.getSessionService(session, user);

        const recvQuestion = await service.addQuestionToSession(question);

        if (recvQuestion.questionStatus === 'unanswered') {
          sessionChannel.to(room).emit('new_question_created', recvQuestion);

          const listOfFavoriteQuestions = await service.getTopFavoriteQuestionsOfSession();

          sessionChannel.to(room).emit('question_top10_changed', {
            listOfFavoriteQuestions,
          });
        } else {
          sessionChannel.adapter.clients([`room_${sessionId}`], (err, clients) => {
            if (err) throw err;

            clients.forEach((client) => {
              if (sessionChannel.connected[client].role === 'editor') {
                sessionChannel.connected[client].emit('new_question_created', recvQuestion);
              }
            });
          });
        }
      } catch (err) {
        console.log(err);
        socket.emit('exception', err);
      }
    });

    socket.on('create_vote', async (data) => {
      try {
        const user = await processUserInfo(data, socket);
        const roomInfo = getRoomInfo(socket);
        const { room } = roomInfo;
        const { sessionId } = roomInfo;
        const question = { questionId: data.questionId };

        const session = await SessionService.getSessionInstance(sessionId);
        const service = await SessionService.getSessionService(session, user);

        const recvQuestion = await service.addVoteToQuestion(question);

        if (recvQuestion.questionStatus === 'unanswered') {
          const listOfFavoriteQuestions = await service.getTopFavoriteQuestionsOfSession();

          sessionChannel.to(room).emit('new_vote_created', {
            question: recvQuestion,
            role: service.role,
          });

          sessionChannel.to(room).emit('question_top10_changed', {
            listOfFavoriteQuestions,
          });
        } else {
          sessionChannel.adapter.clients([`room_${sessionId}`], (err, clients) => {
            if (err) throw err;

            clients.forEach((client) => {
              if (sessionChannel.connected[client].role === 'editor') {
                sessionChannel.connected[client].emit('new_vote_created', {
                  question: recvQuestion,
                  role: service.role,
                });
              }
            });
          });
        }
      } catch (err) {
        console.log(err);
        socket.emit('exception', err);
      }
    });

    socket.on('cancle_vote', async (data) => {
      try {
        const user = await processUserInfo(data, socket);
        const roomInfo = getRoomInfo(socket);
        const { room } = roomInfo;
        const { sessionId } = roomInfo;
        const question = { questionId: data.questionId };

        const session = await SessionService.getSessionInstance(sessionId);
        const service = await SessionService.getSessionService(session, user);

        const recvQuestion = await service.cancelVoteInQuestion(question);

        if (recvQuestion.questionStatus === 'unanswered') {
          const listOfFavoriteQuestions = await service.getTopFavoriteQuestionsOfSession();

          sessionChannel.to(room).emit('new_vote_deleted', {
            question: recvQuestion,
            role: service.role,
          });

          sessionChannel.to(room).emit('question_top10_changed', {
            listOfFavoriteQuestions,
          });
        } else {
          sessionChannel.adapter.clients([`room_${sessionId}`], (err, clients) => {
            if (err) throw err;

            clients.forEach((client) => {
              if (sessionChannel.connected[client].role === 'editor') {
                sessionChannel.connected[client].emit('new_vote_deleted', {
                  question: recvQuestion,
                  role: service.role,
                });
              }
            });
          });
        }
      } catch (err) {
        socket.emit('exception', err);
      }
    });

    socket.on('change_question_status', async (data) => {
      try {
        const user = await processUserInfo(data, socket);
        const roomInfo = getRoomInfo(socket);
        const { room } = roomInfo;
        const { sessionId } = roomInfo;
        const question = { questionId: data.questionId };

        const session = await SessionService.getSessionInstance(sessionId);
        const service = await SessionService.getSessionService(session, user);

        const recvQuestion = await service.updateQuestionStatus(question, data.status);

        if (recvQuestion.questionStatus === 'unanswered' || recvQuestion.questionStatus === 'answered') {
          const listOfFavoriteQuestions = await service.getTopFavoriteQuestionsOfSession();

          sessionChannel.to(room).emit('question_status_changed', {
            question: recvQuestion,
          });

          sessionChannel.to(room).emit('question_top10_changed', {
            listOfFavoriteQuestions,
          });
        } else {
          sessionChannel.adapter.clients([`room_${sessionId}`], (err, clients) => {
            if (err) throw err;

            clients.forEach((client) => {
              if (sessionChannel.connected[client].role === 'editor') {
                sessionChannel.connected[client].emit('question_status_changed', {
                  question: recvQuestion,
                });
              }
            });
          });
        }
      } catch (err) {
        console.log(err);
        socket.emit('exception', err);
      }
    });
  });
};
