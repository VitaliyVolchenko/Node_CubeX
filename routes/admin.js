exports.products = function(req, res) {
    var userId = req.session.userId, roleId = req.session.roleId;
    if(userId == null){
        res.redirect("/login");
        return;
    }
    if(roleId !== 1){
        res.redirect("/home/dashboard");
        return;
    }
    var products ='';
    var sql="SELECT * FROM `products`";

    var query = db.query(sql, function(err, results){
        var products = results;

        res.render('admin/index.ejs',{products: products});
    });
};

exports.productDel = function(req, res) {
    var products = '';

    var post = req.body;
    var id = post.id;

    var sql = "DELETE FROM `products` WHERE `id`='"+id+"'";

    var query = db.query(sql, function (err, results) {

        res.redirect('/admin/index');
    });

};

exports.productAdd = function(req, res) {

    var userId = req.session.userId, roleId = req.session.roleId;
    if(userId == null){
        res.redirect("/login");
        return;
    }
    if(roleId !== 1){
        res.redirect("/home/dashboard");
        return;
    }

    var message ='';

    res.render('admin/product.ejs',{message: message});
};

exports.productSave = function(req, res) {

    var products = '';

    var post = req.body;
    var id = post.id;
    var title = post.title;
    var price = post.price;
    var description = post.description;

    var sql = "INSERT INTO `products`(`title`,`price`,`description`) " +
            "VALUES ('" + title + "','" + price + "','" + description + "')";

    var query = db.query(sql, function (err, results) {

            res.redirect('/admin/index');
        });
};

/*console.log(err);
        var products = results;
        console.log(products);*/