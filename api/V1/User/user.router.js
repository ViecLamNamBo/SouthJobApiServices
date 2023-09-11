const express = require('express');
const passport = require('passport');
const authMiddleware = require('../middlewares/authMiddleware');
const client = require('../helpers/connection_redis');

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
  getInfoOfUser,
} = require('./user.controller');
require('../middlewares/passportMiddleware');

// write log into discord server
// router.use(pushToLogDiscord);

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/refresh').post(requestRefreshToken);
router.route('/userInfo').get(authMiddleware, getInfoOfUser);
router.route('/logout').post(authMiddleware, logoutUser);
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
  async (req, res) => {
    const userInfo = req.user;
    const accessToken = await generateAccessToken(userInfo.candidate_id);
    const refreshToken = await generateRefreshToken(userInfo.candidate_id);
    //   res
    res
      .cookie('accessToken', accessToken, {
        maxAge: 2 * 60 * 60 * 1000, // 2 hours
        httpOnly: true,
        secure: false,
        path: '/',
        sameSite: 'strict',
      })
      .cookie('refreshToken', refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        secure: false,
        path: '/',
        sameSite: 'strict',
      });

    res.redirect('http://localhost:8080');
  }
);

module.exports = router;
