/*
* GET start page.
*/

exports.index = function(req, res) {
    var message = '';
    res.render('index.ejs', {message: message});
}