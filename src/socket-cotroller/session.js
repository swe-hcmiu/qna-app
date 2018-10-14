const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const UserService = require('../services/UserService');
const ValidateSessionHandler = require('../validator/session');
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

    socket.emit('receive token', newToken);
  }
  return user;
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
  });
};
