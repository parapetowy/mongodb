var server = require('./modules/server');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

server.start();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:admindb1@ds159782.mlab.com:59782/db1', {
    /*useMongoClient: true*/
});

//new user Schema
const userSchema = new Schema({
    name: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: Boolean,
    created_at: Date,
    updated_at: Date
});

//Mongoose schema method
userSchema.methods.manify = function(next) {
    this.name = this.name + '-boy';

    return next(null, this.name);
};

//pre-save method
userSchema.pre('save', function(next) {
    //pobranie aktualnego czasu
    const currentDate = new Date();

    //zmiana pola na aktualny czas
    this.updated_at = currentDate;

    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

//model based on userSchema
const User = mongoose.model('User', userSchema);

User.find({}, function(err, res) {
    if (err) throw err;
    console.log('Actual database records are ' + res);
});

const findAllUsers = function() {
    // find all users
    return User.find({}, function(err, res) {
        if (err) throw err;
        console.log('Actual database records are ' + res);
    });
}

