const passport = require('passport');
const mysql = require('mysql');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const objectConnection = require('../../../configs/database.config');
// const {
//   generateRefreshToken,
//   generateAccessToken,
// } = require('../helpers/authHelper');
// Using JWT to authentication,  comment code under line to block info saved into session
// passport.serializeUser(function (user, done) {
//   process.nextTick(function () {
//     return done(null, {
//       id: user.id,
//       username: user.username,
//       picture: user.picture,
//     });
//   });
// });

// passport.deserializeUser(function (user, done) {
//   process.nextTick(function () {
//     return done(null, user);
//   });
// });
// check if google profile exit.
const checkGoogleProfileExit = async (userGoogleProfile, done) => {
  try {
    const connection = mysql.createPool(objectConnection);
    const sqlQuery = 'CALL RegisterCandidateWithGoogleAccount(?,?,?) ';
    connection.query(
      sqlQuery,
      [
        userGoogleProfile.email,
        userGoogleProfile.full_name,
        userGoogleProfile.avatar,
      ],
      async function checkErrorOfQuery(err, result) {
        if (err) {
          return done(true, err);
        }
        const candidateInformation = JSON.parse(JSON.stringify(result))[0];
        // information of user is  an array with  object info
        const candidateInformationData = {
          candidate_id: candidateInformation[0].candidate_id,
          email: candidateInformation[0].email,
        };

        done(false, candidateInformationData);
        return null;
      }
    );
  } catch (err) {
    done(true, err);
  }
};
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECERET,
      callbackURL: process.env.GOOGLE_CALLBACK,
      passReqToCallback: true,
    },
    function (req, accessToken, refreshToken, profile, done) {
      const userGoogleProfile = {
        email: profile.email,
        full_name: profile.displayName,
        avatar: profile.picture,
      };
      checkGoogleProfileExit(userGoogleProfile, done);
    }
  )
);
