const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('session');
});

router.get('/:sessionId', (req, res) => {
  res.render('questionBoard');
});

router.get('/:sessionId/editors', (req, res) => {
  res.render('editor');
});

module.exports = router;
