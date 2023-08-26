const express = require('express');
const router = express.Router();
const { pushToLogDiscord } = require('../middlewares/pushToLogger');

router.use(pushToLogDiscord);

module.exports = router;
