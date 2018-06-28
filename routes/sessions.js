var express = require('express');
var router = express.Router();
var SessionController = require('../src/Controller/SessionController');

router.get('/', SessionController.session_get);
router.post('/', SessionController.session_post);

router.get('/:sessionId',SessionController.sessionId_get);

module.exports = router;
