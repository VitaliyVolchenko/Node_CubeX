exports.index = function(req, res) {
    var message = '';
    res.render('login.ejs', {message: message});
}

exports.login = function(req, res){
    var message = '';
    var rolId = '1';
    var saltRounds = 10;
    if(req.method === "POST"){
        var post  = req.body;
        var name = post.user_name;
        var pass = post.password;

        var sql="SELECT * FROM `users` WHERE `user_name`='"+name+"' ";
        var query =  db.query(sql, function(err, results){
            console.log(results[0],"Resoult");
            if(results[0] === undefined){
                message = 'That user name not exist'
                return res.render('login.ejs',{message: message});
            }

            require('bcrypt').compare(pass, results[0].password, function(err, same) {

                if(same){
                    req.session.userId = results[0].id;
                    req.session.roleId = results[0].role_id;
                    req.session.user = results[0];
                    //console.log(req.session, 'AAAAAAAAAAAA');
                    if(results[0].role_id == rolId){
                        res.redirect('/admin/index');
                    } else {
                        console.log(results[0].id);
                        res.redirect('/home/dashboard');
                    }

                } else {
                    message = 'Wrong Credentials.';
                    res.render('login.ejs',{message: message});
                }

            });

        });

    } else {
        res.redirect('/',{message: message});
    }
};

//check unique user_name(exist user in db or not)
check = function(name,cb){

    sql="SELECT id, first_name, last_name, user_name, password, role_id FROM `users` WHERE" +
        " `user_name`='"+name+"' ";

    var query =  db.query(sql, function(err, res){
        if(res[0]){
            cb(false) ;
        }
        cb(true);
    });
}

exports.signup = function(req, res){
    message = '';
    mess = '';

    if(req.method == "POST"){
        var post  = req.body;
        var name = post.user_name;
        var pass = post.password;
        var fname = post.first_name;
        var lname = post.last_name;
        var email = post.email;
        var saltRounds = 10;

        req.check("first_name", "Enter first name 3-40 chars!").isLength({min: 3, max: 40});
        req.check("first_name", "Enter letters in first_name!").isAlpha();

        req.check("last_name", "Enter last name 3-40 chars!").isLength({min: 3, max: 40});
        req.check("last_name", "Enter letters in last_name!").isAlpha();

        req.check("email", "Enter a valid email address!").isEmail();

        req.check("user_name", "Enter last name 3-40 chars!").isLength({min: 3, max: 40});

        req.check("confpass", "Enter a valid password!").isLength({min: 4});
        req.check("confpass", "Enter valid confirm password!").equals(pass);

        let errors = req.validationErrors();
        if (errors){
            req.session.errors = errors;
            console.log(req.session.error);
            res.redirect('back');
            return;
        }

        var roleId = '2';

        check(name,(result)=>{
            if(result){
                require('bcrypt').hash(pass, saltRounds, function(err, hash) {
                    //console.log(hash, 'AAAAAAAA');
                    var sql = "INSERT INTO `users`(`first_name`,`last_name`,`email`,`user_name`, `password`, `role_id`) " +
                        "VALUES ('" + fname + "','" + lname + "','" + email + "','" + name + "','" + hash + "','" + roleId + "')";

                    var query = db.query(sql, function (err, result) {
                        if(err){throw  err};
                        message = "Succesfully! Your account has been created.";
                        res.render('signup.ejs', {message: message, errors: req.session.errors});
                    })
                });
            } else {
                mess = "This user name already exist!";
                res.render('signup',{mess: mess, errors:req.session.errors});
            }
        });

    } else {
        res.render('signup',{errors:req.session.errors});
        req.session.destroy();
    }
};

exports.dashboard = function(req, res, next){

    var userId = req.session.userId;

    if(userId == null){
        res.redirect("/login");
        return;
    }

    var products ='';
    var sql="SELECT * FROM `products`";

    var query = db.query(sql, function(err, results){
        var products = results;

        for(var i=0; i<products.length; i++) {
            var d = new Date(products[i].created_at);
            console.log(products[i].created_at);
            products[i].created_at = d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear()+
                "  "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
            console.log(products[i].created_at);
        }
        res.render('profile.ejs',{products: products});
    });
};

exports.logout = function (req, res, next){
    req.session.destroy();
    res.redirect('/');
};

exports.buy = function(req, res) {

    var userId = req.session.userId;
    var stripe = require("stripe")("sk_test_FVg7n3n3FHizeJeDRMy4Xx4g")
    var post = req.body;
    var id = post.id;
    req.session.prodId = id;
    var token = post.stripeToken;
    var chargeAmount = post.chargeAmount*100;
    var charge = stripe.charges.create({
        amount: chargeAmount,
        currency: token,
        source: token
    }, function(err, charge) {
        if (err & err.type === "StripeCardError") {
            console.log("Your card was decliend");
        }
    });

    //req.session.

        var sql = "INSERT INTO `orders`(`user_id`,`product_id`) " +
            "VALUES ('" + userId + "','" + id + "')";

        var query = db.query(sql, function (err, results) {
            console.log("Your payment was successful!");
            res.redirect('/home/orders');
        });
}

exports.orders = function(req, res) {

    var userId = req.session.userId;
    var prodId = req.session.prodId;

    console.log(userId);

    if(userId == null){
        res.redirect("/login");
        return;
    }

    var sql = "SELECT `products`.title, `products`.price, `products`.description, `orders`.created_at FROM `products`" +
        "INNER JOIN `orders` ON `products`.id = `orders`.product_id AND `orders`.user_id = '" + userId + "' ORDER BY `orders`.created_at DESC";
    var query = db.query(sql, function (err, results) {
        console.log(results);

        var orders = results;
        for(var i=0; i<orders.length; i++) {
            var d = new Date(orders[i].created_at);
            console.log(orders[i].created_at);
            orders[i].created_at = d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear()+
                "  "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
            console.log(orders[i].created_at);
        }

        res.render('orders.ejs',{orders: orders});
    });

};

