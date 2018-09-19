const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var http = require('http');
var fs = require('fs');

var server = http.createServer();

server.on('request', function(request, response) {
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    if (request.method === 'GET' && request.url === '/') {
        fs.readFile('./index.html', 'utf-8', function(err, data) {
            response.write(data);
            response.end();
        });

    } else {
        response.setHeader("Content-Type", "image/jpeg; charset=utf-8");
        fs.readFile('./sadcat.jpg', function(err, data) {
            response.write(data);
            response.end();
        });

    }
});

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

server.listen(80);