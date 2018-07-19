/*
* GET start page.
*/

exports.index = function(req, res) {

    var sql="SELECT * FROM `products`";
    var products ='';

    console.log(products);

    var query = db.query(sql, function(err, results){

        var products = results;
        for(var i=0; i<products.length; i++) {
            var d = new Date(products[i].created_at);
            console.log(products[i].created_at);
            products[i].created_at = d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear()+
                "  "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
            console.log(products[i].created_at);
        }

        res.render('index.ejs',{products: products});
    });

}