const express = require('express');
const passport = require('passport');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
const {
  generateRefreshToken,
  generateAccessToken,
} = require('../helpers/authHelper');
// const { pushToLogDiscord } = require('../middlewares/pushToLogger');
const {
  registerUser,
  loginUser,
  requestRefreshToken,
  logoutUser,
} = require('./user.controller');
require('../middlewares/passportMiddleware');

// write log into discord server
// router.use(pushToLogDiscord);

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

router.route('/login/google').get(
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
  })
);
router.route('/login/google/callback').get(
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/failed',
  }),
  function (req, res) {
    const userInfo = req.user;
    const accessToken = generateAccessToken(userInfo);
    const refreshToken = generateRefreshToken(userInfo);
    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        path: '/',
        sameSite: 'strict',
      })
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false,
        path: '/',
        sameSite: 'strict',
      });
    res.redirect('http://localhost:8080');
  }
);

router.route('/refresh').post(requestRefreshToken);
router.route('/logout').post(authMiddleware, logoutUser);

module.exports = router;
