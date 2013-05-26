/**
 * Created with JetBrains WebStorm.
 * User: dave
 * Date: 26/05/13
 * Time: 5:01 PM
 * To change this template use File | Settings | File Templates.
 */

var mongo = require('mongodb');

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

    res.send("Database cleared");
};

exports.load = function(req, res){

    db.collection('people', function(err, collection) {
        collection.insert( { name: "Bob"}, {safe:true}, function(err, result) {});
    });

    res.send("Database loaded");
};