const express = require('express');

const router = express.Router();
// const { pushToLogDiscord } = require('../middlewares/pushToLogger');
const { registerUser } = require('./user.controller');

// write log into discord server
// router.use(pushToLogDiscord);

router.route('/register').post(registerUser);

module.exports = router;
