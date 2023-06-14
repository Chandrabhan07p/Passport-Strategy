const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User must have a name!'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'User must have an email!'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'User must have a strong password'],
        minlength: [6, 'Password should contain atleast 6 characters.'],
        maxlength: [16, 'Password should not contain more than 16 characters.'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function (val) {
                return val === this.password
            },
            message: 'Both passwords should match.'
        }
    },
    googleId: {
        type: String
    },
    githubId: {
        type: String
    }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 8);
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.checkPassword = async (inpPassword, oriPassword) => {
    console.log('inpPassword', inpPassword, oriPassword)
    return await bcrypt.compare(inpPassword, oriPassword);
}

module.exports = mongoose.model('User', userSchema);