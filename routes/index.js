/*
* GET start page.
*/

exports.index = function(req, res) {

    var sql="SELECT * FROM `products`";
    var products ='';

    console.log(products);

    var query = db.query(sql, function(err, results){

        var products = results;

        res.render('index.ejs',{products: products});
    });

}