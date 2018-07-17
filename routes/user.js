exports.index = function(req, res) {
    var message = '';
    res.render('login.ejs', {message: message});
}

exports.login = function(req, res){
    var message = '';
    var sess = req.session;
    var rolId = '1';

    if(req.method === "POST"){
        var post  = req.body;
        var name= post.user_name;
        var pass= post.password;

        var sql="SELECT id, first_name, last_name, user_name, password, role_id FROM `users` WHERE `user_name`='"+name+"' and password = '"+pass+"'";

        db.query(sql, function(err, results){

            if(results.length){
                req.session.userId = results[0].id;
                req.session.roleId = results[0].role_id;
                req.session.user = results[0];
                //console.log(sess, 'AAAAAAAAAAAA');
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
    } else {
        res.render('index.ejs',{message: message});
    }
};

exports.signup = function(req, res){
    message = '';
    if(req.method == "POST"){
        var post  = req.body;
        var name= post.user_name;
        var pass= post.password;
        var fname= post.first_name;
        var lname= post.last_name;
        var email= post.email;
        var roleId = '2';

        var sql = "INSERT INTO `users`(`first_name`,`last_name`,`email`,`user_name`, `password`, `role_id`) " +
            "VALUES ('" + fname + "','" + lname + "','" + email + "','" + name + "','" + pass + "','" + roleId + "')";

        var query = db.query(sql, function(err, result) {

            message = "Succesfully! Your account has been created.";
            res.render('signup.ejs',{message: message});
        });

    } else {
        res.render('signup');
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

        res.render('profile.ejs',{products: products});
    });
};

exports.logout = function (req, res, next){
    req.session.destroy();
    res.redirect('/');
};


