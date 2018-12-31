const express = require('express');

const router = express.Router();
const passport = require('passport');
const SessionController = require('../src/sessions/SessionController');

router.get('/', SessionController.session_get);
router.get('/opening', SessionController.session_get_opening);
router.get('/closed', SessionController.session_get_closed);

router.use(passport.authenticate('jwt', { session: false }));

router.post('/', SessionController.session_post);

router.get('/:sessionId', SessionController.sessionId_get);
router.delete('/:sessionId', SessionController.sessionId_delete);

router.put('/:sessionId/status', SessionController.sessionId_status_put);

router.get('/:sessionId/questions/newest', SessionController.sessionId_question_newest);
router.get('/:sessionId/questions/top', SessionController.sessionId_question_top);
router.get('/:sessionId/questions/answered', SessionController.sessionId_question_answered);
router.get('/:sessionId/questions/pending', SessionController.sessionId_question_pending);
router.get('/:sessionId/questions/invalid', SessionController.sessionId_question_invalid);
router.post('/:sessionId/questions/', SessionController.sessionId_question_post);

router.get('/:sessionId/questions/:questionId', SessionController.sessionId_questionId_get);

router.put('/:sessionId/questions/:questionId/vote', SessionController.sessionId_questionId_vote_put);
router.delete('/:sessionId/questions/:questionId/vote', SessionController.sessionId_questionId_vote_delete);

router.put('/:sessionId/questions/:questionId/status', SessionController.sessionId_questionId_status_put);

router.get('/:sessionId/editors', SessionController.sessionId_editor_get);
router.post('/:sessionId/editors/permissions', SessionController.sessionId_editor_permission_post);
router.delete('/:sessionId/editors/permissions', SessionController.sessionId_editor_permission_delete);

router.get('/:sessionId/users/vote', SessionController.sessionId_user_vote);

module.exports = router;
