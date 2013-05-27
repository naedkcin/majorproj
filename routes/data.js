/**
 * Created with JetBrains WebStorm.
 * User: dave
 * Date: 26/05/13
 * Time: 5:01 PM
 * To change this template use File | Settings | File Templates.
 */

var mongo = require('mongodb');
var fs = require('fs');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('test', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to " + db.databaseName + " database");
    }
});

exports.clear = function(req, res){

    db.collection('people', function(err, collection) {
        collection.remove(function(err, result) {});
    });

    res.render('index', { title: 'Database cleared', tab: "clear" });
};

exports.load = function(req, res){

    var buf = [];

    fs.readFile('people.csv', function(err, data) {
        if (err) throw err;

        buf = data.toString().split("#\r\n");

        console.log(buf);

        for(var i = 0; i < buf.length; i++) {

            var peopleObj = {};
            var peopleRec = [];

            peopleRec = buf[i].split(",");

            peopleObj.firstname = peopleRec[0];
            peopleObj.lastname = peopleRec[1];
            peopleObj.email = peopleRec[2];
            peopleObj.homephone = peopleRec[3];
            peopleObj.mobile = peopleRec[5];
            peopleObj.address = peopleRec[6];

            console.log(peopleObj);

            db.collection('people', function(err, collection) {
                collection.insert( peopleObj , {safe:true}, function(err, result) {});
            });

        }

        res.render('index', { title: 'Database loaded', tab: "load" });

    } )

};

exports.list = function (req, res){

    //var peopleArr = [];

    db.collection('people', function(err, collection) {
//        collection.find({ firstname: { $regex : '^S' } }).toArray(function(err, docs) {
        collection.find({  }).toArray(function(err, docs) {
            res.render('table', { title: 'People', people: docs });
        });
    });

};