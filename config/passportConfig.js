const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/userModel');

const sessionConfig = require('./../config/sessionConfig');

const passportJWT = require('passport-jwt');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

// local strategy
passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async function (email, password, done) {
        try {
            const user = await User.findOne({ email: { $regex: new RegExp('^' + email + '$', 'i') } }).select('+password');

            // For custom validation messages use error handling
            if (!user)
                return done(null, false, 'Incorrect credentials');

            const validPassword = await user.checkPassword(password, user.password);
            if (!validPassword)
                return done(null, false, 'Incorrect credentials');

            return done(null, user);

        } catch (err) {
            console.log('err in local strategy', err);
            return done(err);
        }
    }
));

// Configure Passport session serialization and deserialization
// If session is set to false then no use
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});




// jwt strategy
const jwtOptions = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: sessionConfig.secret
}

console.log('jwtoptions', jwtOptions);

passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {

        console.log('jwtpayload', jwtPayload);
        const user = await User.findById(jwtPayload.id).lean();
        if (!user) {
            return done(null, false, { message: 'Somethings Went wrong.' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));


passport.use(new GoogleStrategy(
    {
        clientID: '90669707792-cs4ju6rdr4as3nhr8e2m099j6613isnq.apps.googleusercontent.com',
        clientSecret: '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',
        consumerKey: 'somerandomkey',
        consumerSecret: 'justStrongtokenwhatever',
        callbackURL: 'http://localhost:5050/api/v1/users/oauth/google/redirect',
    },
    async function (accessToken, refreshToken, profile, done) {
        try {
            const result = await User.updateOne(
                { name: profile.displayname, email: profile._json.email },
                { googleId: profile.id },
                {
                    upsert: true
                }
            );
            return result ? done(null, result) : done(null, false);

        }
        catch (err) {
            done(err);
        }
    }
));


passport.use(new GitHubStrategy(
    {
        clientID: '839827b5a929921e1577',
        clientSecret: '42177301025a1b3eae1f7445757b145c0432f23e',
        consumerKey: 'somerandomkey',
        consumerSecret: 'justStrongtokenwhatever',
        callbackURL: 'http://localhost:5050/api/v1/users/oauth/github/redirect',
    },
    async function (accessToken, refreshToken, profile, done) {

        console.log(profile.id);
        try {
            const result = await User.updateOne(
                { name: profile.username, email: profile._json.email },
                { githubId: profile.id },
                {
                    upsert: true
                }
            );
            return result ? done(null, result) : done(null, false);

        }
        catch (err) {
            done(err);
        }
    }
));





module.exports = passport;