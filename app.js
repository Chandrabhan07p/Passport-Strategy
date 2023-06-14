const express = require('express');
const userRouter = require('./routes/userRouter');
const path = require('path');
const app = express();
const session = require('express-session');
const sessionConfig = require('./config/sessionConfig');
const passportConfig = require('./config/passportConfig');
// dealing with html form not json this time
const bodyParser = require('body-parser');

// strategy initialize
app.use(passportConfig.initialize());

// session
app.use(session(sessionConfig))
app.use(passportConfig.session());

//  jwt
const jwt = require('jsonwebtoken');

// body parser
app.use(express.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded());

// views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));


// routes
app.use('/api/v1/users', userRouter);


const userFactory = async (seed) => {
    const user = require('./models/userModel');
    return await user.create(seed);
}


app.use('/seed', async (req, res) => {
    try {
        const seed = {
            name: 'Dvorak',
            email: 'letscode@coders.com',
            password: '987654',
            passwordConfirm: '987654'
        };
        const result = await userFactory(seed);
        if (result) return res.send(result).status(201);
        else return res.send('Something went wrong').status(400);
    }
    catch (err) {
        console.log(err);
    }
});

app.use('/seed-jwt', async (req, res) => {
    try {
        const seed = {
            name: 'Dvorak',
            email: 'letscodewithme@coders.com',
            password: '987654',
            passwordConfirm: '987654'
        }
        const user = await userFactory(seed);
        if (user) {
            const token = jwt.sign({ id: user._id }, sessionConfig.secret, {
                expiresIn: '1d'
            });
            user.password = undefined;
            req.user = user
            req.token = token;

            return res.send(req.token);
        }
    } catch (error) {
        console.log(err);
    }
});

app.use('/', (req, res) => {
    res.render('login');
});

app.use('/login', (req, res) => {
    res.render('login');
});


module.exports = app;
