'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  users = require('../../controllers/users.server.controller');

module.exports = function (config) {
  // Use google strategy
  if (!process.env.GOOGLE_ID) {
    console.log('NO GOOGLE ID');
  } else {
    console.log('GOOGLE ID = ' + process.env.GOOGLE_ID);
  }
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID || config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: process.env.GOOGLE_CALLBACK || config.google.callbackURL,
    passReqToCallback: true,
    scope: [
      // 'https://www.googleapis.com/auth/userinfo.profile',
      // 'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/adwords'
    ]
  },
    function (req, accessToken, refreshToken, profile, done) {
      console.log('IN CALLBACK');
      console.log('REQ USER? = ' + JSON.stringify(req.user));
      console.log('PROFILE = ' + JSON.stringify(profile));
      // Set the provider data and include tokens
      var providerData = profile._json;
      providerData.accessToken = accessToken;
      providerData.refreshToken = refreshToken;
      // console.log('PROVIDER DATA = ' + JSON.stringify(providerData));
      // Create the user OAuth profile
      var providerUserProfile = {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        username: profile.username,
        profileImageURL: (providerData.picture) ? providerData.picture : undefined,
        provider: 'adwords',
        providerIdentifierField: 'id',
        providerData: providerData
      };
      console.log('PROVIDER USER PROFILE = ' + JSON.stringify(providerUserProfile));
      // Save the user OAuth profile
      users.saveOAuthUserProfile(req, providerUserProfile, done);
    }));
};
