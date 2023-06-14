const mongoose = require('mongoose');
const app = require('./app.js');

const db = 'mongodb+srv://courageTheCowardlyDog:e2VkXTwpdQzDa19v@dummyprojects.hykmfdu.mongodb.net/passport';
const port = 5050;

mongoose.connect(db)
    .then((con) => console.log('DB connected'))
    .catch((err) => console.log('Error in mongo connection', err));

const server = app.listen(port, () => {
    console.log(`App started on - 127.0.0.1:${port}`)
});

