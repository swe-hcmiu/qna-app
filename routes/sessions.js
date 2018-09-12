const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('session');
});

router.get('/:sessionId', (req, res) => {
  res.render('questionBoard');
});

module.exports = router;
