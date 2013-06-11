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
    if (err) throw err;
    console.log("Connected to " + db.databaseName + " database");
});

exports.clear = function(req, res){

    db.collection('people', function(err, collection) {
        if (err) throw err;
        collection.remove(function(err, result) {
            if (err) throw err;
            res.render('index', { title: 'Database cleared', tab: "clear" });
        });
    });


};

exports.load = function(req, res){

    var buf = [];

    fs.readFile('contacts.csv', function(err, data) {
        if (err) throw err;

        buf = data.toString().split("#\n");

        console.log(buf);

        for(var i = 0; i < buf.length; i++) {

            var peopleObj = {};
            var peopleRec = [];

            peopleRec = buf[i].split(",");

            peopleObj.firstname = peopleRec[0];
            peopleObj.lastname = peopleRec[1];
            peopleObj.email = peopleRec[2];
            peopleObj.homephone = peopleRec[3];
            peopleObj.mobile = peopleRec[4];
            peopleObj.address = peopleRec[5];

            console.log(peopleObj);

            db.collection('people', function(err, collection) {
                if (err) throw err;
                collection.insert( peopleObj , {safe:true}, function(err, result) {
                    if (err) throw err;
                });
            });

        }

        res.render('index', { title: 'Database loaded', tab: "load" });

    } )

};

exports.list = function (req, res){

    db.collection('people', function(err, collection) {
        if (err) throw err;
        collection.find().toArray(function(err, docs) {
            if (err) throw err;
            res.render('table', { title: 'People', tab: "list" , people: docs });
        });
    });

};

exports.addForm = function (req, res){

    res.render('addForm', { title: 'Add Contact', tab: "add" });

};

exports.addRecord = function (req, res){

    db.collection('people', function(err, collection) {
        if (err) throw err;
        console.log(req.body);
        collection.insert( req.body , function(err, result) {
            if (err) throw err;
            res.render('addRecord', { title: 'Add Contact', tab: "add" , row: req.body });
        });
    });



};

exports.updateForm = function (req, res){

    var obj_id = new BSON.ObjectID(req.params._id); // This converts the _id into a proper ObjectId for the .remove

    db.collection('people', function(err, collection) {
        if (err) throw err;
        console.log(req.param);
        collection.findOne({ _id: obj_id }, function(err, result) {
            if (err) throw err;
            res.render('updateForm', { title: 'Update Contact', tab: "list", row: result });
        });
    });
};

exports.updateRecord = function (req, res){

    var obj_id = new BSON.ObjectID(req.params._id); // This converts the _id into a proper ObjectId for the .update

    db.collection('people', function(err, collection) {
        if (err) throw err;
        console.log(req.body);
        collection.update( { _id: obj_id }, req.body , function(err, result) {
            if (err) throw err;
            res.redirect('/list');
        });
    });

};

exports.remove = function (req, res){

    var obj_id = new BSON.ObjectID(req.params._id); // This converts the _id into a proper ObjectId for the .remove

    db.collection('people', function(err, collection) {
        if (err) throw err;
        console.log(req.query);
        collection.remove({ _id: obj_id }, function(err, result) {
            if (err) throw err;
            res.redirect("/list");
        });

    });

};