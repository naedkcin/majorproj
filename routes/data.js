/**
 * Created with JetBrains WebStorm.
 * User: dave
 * Date: 26/05/13
 * Time: 5:01 PM
 * To change this template use File | Settings | File Templates.
 */

var fs = require('fs');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log("Connected to " + db.db.databaseName + " database");
});

var peopleSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    homephone: String,
    mobile: String,
    address: String
});

var people = mongoose.model('people', peopleSchema);

exports.clear = function(req, res){

    people.remove({}, function (err) {
        if (err) return handleError(err);
        res.render('index', { title: 'Database cleared', tab: "clear" });
    });

};

exports.load = function(req, res){

    var buf = [];

    fs.readFile('contacts.csv', function(err, data) {
        if (err) throw err;

        buf = data.toString().split("#\r\n");

        console.log(buf);

        for(var i = 0; i < buf.length; i++) {

            var peopleObj = new people();
            var peopleRec = [];

            peopleRec = buf[i].split(",");

            peopleObj.firstname = peopleRec[0];
            peopleObj.lastname = peopleRec[1];
            peopleObj.email = peopleRec[2];
            peopleObj.homephone = peopleRec[3];
            peopleObj.mobile = peopleRec[4];
            peopleObj.address = peopleRec[5];

            console.log(peopleObj);

            peopleObj.save(function (err) {
                if (err) return handleError(err);
                console.log("people added");
            });

        }

        res.render('index', { title: 'Database loaded', tab: "load" });

    } )

};

exports.list = function (req, res){

    people.find({}, function(err, docs) {
        res.render('table', { title: 'People', tab: "list" , people: docs });
    });

};

exports.addForm = function (req, res){

    res.render('addForm', { title: 'Add Contact', tab: "add" });

};

exports.addRecord = function (req, res){

    var peopleObj = new people(req.body);

    console.log(peopleObj);

    peopleObj.save(function (err) {
        if (err) return handleError(err);
        console.log("people added");
    });

    res.render('addRecord', { title: 'Add Contact', tab: "add" , row: peopleObj });

};

exports.remove = function (req, res){

    people.findOneAndRemove({ _id: req.query._id}, function (err) {
        if (err) return handleError(err);
        console.log(req.query);
        res.redirect("/list");
    });

};