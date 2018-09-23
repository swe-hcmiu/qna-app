const express = require('express');

const router = express.Router();
const SessionController = require('../src/controller/SessionController');

router.get('/', SessionController.session_get);
router.post('/', SessionController.session_post);

router.get('/:sessionId', SessionController.sessionId_get);
router.delete('/:sessionId', SessionController.sessionId_delete);

router.get('/:sessionId/questions/', SessionController.sessionId_question_get);
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
