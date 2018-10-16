const express = require('express');

const router = express.Router();
const passport = require('passport');
const SessionController = require('../src/controller/SessionController');

router.get('/', SessionController.session_get);
router.post('/', passport.authenticate('jwt', { session: false }), SessionController.session_post);

router.get('/:sessionId', passport.authenticate('jwt', { session: false }), SessionController.sessionId_get);
router.delete('/:sessionId', passport.authenticate('jwt', { session: false }), SessionController.sessionId_delete);

router.put('/:sessionId/status', SessionController.sessionId_status_put);

router.get('/:sessionId/questions/newest', SessionController.sessionId_question_newest);
router.get('/:sessionId/questions/top', SessionController.sessionId_question_top);
router.get('/:sessionId/questions/answered', SessionController.sessionId_question_answered);
router.get('/:sessionId/questions/pending', SessionController.sessionId_question_pending);
router.post('/:sessionId/questions/', passport.authenticate('jwt', { session: false }), SessionController.sessionId_question_post);

router.get('/:sessionId/questions/:questionId', SessionController.sessionId_questionId_get);

router.put('/:sessionId/questions/:questionId/vote', SessionController.sessionId_questionId_vote_put);
router.delete('/:sessionId/questions/:questionId/vote', SessionController.sessionId_questionId_vote_delete);

router.put('/:sessionId/questions/:questionId/status', SessionController.sessionId_questionId_status_put);

router.get('/:sessionId/editors', passport.authenticate('jwt', { session: false }), SessionController.sessionId_editor_get);
router.post('/:sessionId/editors/permissions', passport.authenticate('jwt', { session: false }), SessionController.sessionId_editor_permission_post);
router.delete('/:sessionId/editors/permissions', passport.authenticate('jwt', { session: false }), SessionController.sessionId_editor_permission_delete);

router.get('/:sessionId/users/vote', SessionController.sessionId_user_vote);

module.exports = router;
