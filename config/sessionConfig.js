// we are use express-session pakage to create session
// the defualt store with express session is not recommended
// so mongo store 
const mongoStore = require('connect-mongo');

module.exports = {
    secret: 'this key will be used to sign',
    resave: false,
    saveUninitialized: true,
    store: mongoStore.create(
        {
            mongoUrl: 'mongodb+srv://courageTheCowardlyDog:e2VkXTwpdQzDa19v@dummyprojects.hykmfdu.mongodb.net/passport',
            collectionName: 'sessions'
        }
    ),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}