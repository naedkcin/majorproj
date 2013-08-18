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

// Startup function: throws an error to the console if an error occurs; otherwise displays connection message.

db.open(function(err, db) {
    if (err) throw err;
    console.log("Connected to " + db.databaseName + " database");
});

// Clear function: clears the 'posts' collection

exports.clear = function(req, res){

    db.collection('posts', function(err, collection) {
        if (err) throw err;

        collection.remove(function(err, result) {
            if (err) throw err;

            res.render('index', { title: 'imgDesk - Posts Cleared', tab: "clear" });
        });
    });


};

// List function: Lists the entire contents of the database
exports.list = function (req, res){

    db.collection('posts', function(err, collection) {
        if (err) throw err;
        collection.find().toArray(function(err, myPostArray) {
            if (err) throw err;

            if (myPostArray.length === 0){
                res.render('help', { title: 'imgDesk - No Posts To List', tab: "help"});
            }

            else{
            res.render('table', { title: 'imgDesk - List Posts', tab: "list" , posts: myPostArray });
            }
        });
    });

};

//Function used to display a page where users can use addRecord

exports.addForm = function (req, res){

    res.render('addForm', { title: 'imgDesk - Create Post', tab: "add" });

};

// Function which inserts objects into the database
exports.addRecord = function (req, res){

    db.collection('posts', function(err, collection) {
        if (err) throw err;
        req.body.date = new Date();
        console.log(req.body);
        collection.insert( req.body , function(err, result) {
            if (err) throw err;
            res.render('addRecord', { title: 'imgDesk - Create Post', tab: "add" , row: req.body });
        });
    });



};

// Function used to find the object which will be updated
exports.updateForm = function (req, res){

    var obj_id = new BSON.ObjectID(req.params._id); // This converts the _id into a proper ObjectId for the .remove

    db.collection('posts', function(err, collection) {
        if (err) throw err;
        console.log(req.param);
        collection.findOne({ _id: obj_id }, function(err, result) {
            if (err) throw err;
            res.render('updateForm', { title: 'imgDesk - Update Post', tab: "list", row: result });
        });
    });
};

//Function used to update items in the database
exports.updateRecord = function (req, res){

    var obj_id = new BSON.ObjectID(req.params._id); // This converts the _id into a proper ObjectId for the .update

    db.collection('posts', function(err, collection) {
        if (err) throw err;
        console.log(req.body);
        collection.update( { _id: obj_id }, req.body , function(err, result) {
            if (err) throw err;
            res.redirect('/list');
        });
    });

};

// Function used to delete items from the database
exports.remove = function (req, res){

    var obj_id = new BSON.ObjectID(req.params._id); // This converts the _id into a proper ObjectId for the .remove

    db.collection('posts', function(err, collection) {
        if (err) throw err;
        console.log(req.query);
        collection.remove({ _id: obj_id }, function(err, result) {
            if (err) throw err;
            res.redirect("/list");
        });

    });

};

// Function to call 'bubblesort', resolves any issues with the size of arrays

exports.sort = function (req, res) {
    //res.render('index', { title: 'Sort function', tab: "sort"});

    db.collection('posts', function(err, collection) {
        if (err) throw err;
        collection.find().toArray(function(err, myPostArray) {
            if (err) throw err;

            if (myPostArray.length == 0) {

                res.render('noresult', { title: 'imgDesk - No Posts To Sort', tab: "no result"})


            }

            else {

            bubblesort(myPostArray, "heading");

            res.render('sortedtable', { title: 'imgDesk - Posts Sorted By Heading' , tab: "sort" , posts: myPostArray });

            }
        });
    });



};

// Sorts the posts

var bubblesort = function (arrayname, key) {

    var last = arrayname.length-1;
    var swapped = true;

    while(swapped==true) {

        swapped = false;
        var i = 0;

        while (i<last) {

            if (arrayname[i][key] > arrayname[i+1][key]) {

                var temp = arrayname[i];
                arrayname[i] = arrayname[i+1];
                arrayname[i+1] = temp;

                swapped = true;


            }

            i = i+1;
        }
       last = last-1;
    }

    console.log(arrayname[0]);

}


exports.searchForm = function (req, res){

    res.render('searchForm', { title: 'Search Posts', tab: "search" });

};

// This function resolves anny errors relating to the size of an array, then calls the following function

exports.doSearch = function (req, res) {
    //res.render('index', { title: 'Search function', tab: "search"});

    db.collection('posts', function(err, collection) {
        if (err) throw err;
        collection.find().toArray(function(err, myPostArray) {
            if (err) throw err;

            if (myPostArray.length == 0){

                res.render('noresult', {title: 'imgDesk - No Posts To Search', tab: "noresult"});
            }

            else {

                binarySearch(myPostArray, req.body.heading);
                var y = resArr[0]
                console.log(y);

                if (y === true) {

                    res.render('table', { title: 'imgDesk - Search Posts', tab: "search", posts: [ resArr[1] ] });


                }

                else if (y === false) {

                    res.render('noresult', {title: 'imgDesk - No Posts Matched The Search Criteria', tab: "noresult"});

                }

            }



        });
    });

};

// The bulk of the binary search function, this code itself searches through a given array

var binarySearch = function(searchArr, searchHeading) {

    //console.log(searchTitle)

        console.log(searchArr.length);

        var lower = 0;
        var upper = searchArr.length;
        var foundit= false;

        do {


            var m = Math.floor((upper+lower)/2);

            if (searchHeading === searchArr[m].heading) {
                foundit = true;
                var positionfound = m;

            }

            else if (searchHeading !== searchArr[m].heading) {
                upper = m-1;
            }

            else {
                lower = m+1;
            }

        }

        while (!(foundit === true || (lower>upper)))

        if (foundit === true) {
            console.log("found")
            return resArr = [true, searchArr[m]]

        }

        else if (foundit === false) {
            console.log("not found")
            return resArr = [false]

        }
}


//Help function: This is simply used to render the help page
exports.help = function (req, res) {
    res.render('help', { title: 'imgDesk - Help', tab: "help"});
}
