exports.index = function(req, res) {
    var message = '';
    res.render('login.ejs', {message: message});
}

exports.login = function(req, res){
    var message = '';
    var sess = req.session;
    var admin = 'admin';

    if(req.method === "POST"){
        var post  = req.body;
        var name= post.user_name;
        var pass= post.password;

        var sql="SELECT id, first_name, last_name, user_name, password FROM `users` WHERE `user_name`='"+name+"' and password = '"+pass+"'";

        db.query(sql, function(err, results){

            if(results.length){
                req.session.userId = results[0].id;
                req.session.user = results[0];

                if(results[0].user_name === admin && pass === results[0].password ){
                    res.redirect('/admin/index');
                } else {
                    console.log(results[0].id);
                    res.redirect('/home/dashboard');
                }


            }
            else {
                message = 'Wrong Credentials.';
                res.render('index.ejs',{message: message});
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

    var user =  req.session.user,
        userId = req.session.userId;

    if(userId == null){
        res.redirect("/home/login");
        return;
    }

    var sql="SELECT * FROM `login_details` WHERE `id`='"+userId+"'";

    db.query(sql, function(err, results){

        console.log(results);

        res.render('profile.ejs', {user:user});

    });
};

exports.adminka = function(req, res, next){

    var user =  req.session.user,
        userId = req.session.userId;

    if(userId == null){
        res.redirect("/home/login");
        return;
    }

    var sql="SELECT * FROM `login_details` WHERE `id`='"+userId+"'";

    db.query(sql, function(err, results){

        console.log(results);

        res.render('admin/index.ejs', {user:user});

    });
};