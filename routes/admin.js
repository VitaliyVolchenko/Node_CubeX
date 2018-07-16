exports.products = function(req, res) {

    var sql="SELECT * FROM `products`";

    var query = db.query(sql, function(err, results){
        console.log(err);
        var products = results;
        console.log(products);
        res.render('admin/index.ejs',{products: products});
    });
};

/*
exports.products = function(req, res) {
    var message = '';
    res.render('admin/index.ejs', {message: message});
}*/

/*var query = db.query(sql, function(err, result) {

    message = "Succesfully! Your account has been created.";
    res.render('signup.ejs',{message: message});
});*/

/*var productId = results[0].id;
        var title = results[0].title;
        var description = results[0].description;
*/