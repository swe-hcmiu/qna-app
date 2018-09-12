const express = require('express');

const router = express.Router();
const SessionController = require('../src/controller/SessionController');

router.get('/api', SessionController.session_get);
router.post('/api', SessionController.session_post);

router.get('/api/:sessionId', SessionController.sessionId_get);

router.get('/api/:sessionId/questions/', SessionController.sessionId_question_get);
router.post('/api/:sessionId/questions/', SessionController.sessionId_question_post);

router.get('/api/:sessionId/questions/:questionId', SessionController.sessionId_questionId_get);

router.put('/api/:sessionId/questions/:questionId/vote', SessionController.sessionId_questionId_vote_put);
router.delete('/api/:sessionId/questions/:questionId/vote', SessionController.sessionId_questionId_vote_delete);

// router.get('/api/:sessionId/users/:userId/questions/vote',
// SessionController.sessionId_userId_questions_vote);

router.get('/', (req, res) => {
  res.render('session');
});

router.get('/:sessionId', (req, res) => {
  res.render('questionBoard');
});

module.exports = router;
