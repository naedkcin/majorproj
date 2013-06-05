
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Mongo Database test', tab: "home"});
};