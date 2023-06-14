const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../config/passportConfig');
const userController = require('../controllers/userController');

router
    .post('/login', passport.authenticate('local'), userController.login)

    // from local + cookie
    .get('/profile', userController.isAuthenticated, (req, res) => {
        res.send('welcome to profile')
    })

    // for jwt
    .get('/profile-jwt', passport.authenticate('jwt'), (req, res) => {
        res.send('welcome to profile using jwt');
    })

    .get('/oauth/google/', passport.authenticate('google', { scope: ['profile', 'email'] }))
    .get('/oauth/google/redirect/', passport.authenticate('google'), userController.oauthUsingGoogle)

    .get('/oauth/github/', passport.authenticate('github', { scope: ['user:email'] }))
    .get('/oauth/github/redirect', passport.authenticate('github', { failureRedirect: '/login' }), userController.oauthUsingGithub)



module.exports = router;