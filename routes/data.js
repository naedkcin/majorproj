/**
 * Created with JetBrains WebStorm.
 * User: dave
 * Date: 26/05/13
 * Time: 5:01 PM
 * To change this template use File | Settings | File Templates.
 */

exports.clear = function(req, res){
    res.send("Database cleared");
};

exports.load = function(req, res){
    res.send("Database loaded");
};