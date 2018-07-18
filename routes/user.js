exports.index = function(req, res) {
    var message = '';
    res.render('login.ejs', {message: message});
}

exports.login = function(req, res){
    var message = '';
    var sess = req.session;
    var rolId = '1';
    var saltRounds = 10;

    if(req.method === "POST"){
        var post  = req.body;
        var name = post.user_name;
        var pass = post.password;

        var sql="SELECT * FROM `users` WHERE `user_name`='"+name+"' ";
        var query =  db.query(sql, function(err, results){
            require('bcrypt').compare(pass, results[0].password, function(err, same) {
                if(same){
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

        });


    } else {
        res.render('index.ejs',{message: message});
    }
};

//check unique user_name
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
        var confpass = post.confpass;
        var fname = post.first_name;
        var lname = post.last_name;
        var email = post.email;
        var saltRounds = 10;
        //validation email and password
        req.check("email", "Enter a valid email address.").isEmail();
        req.check("confpass", "Enter a valid password.").isLength({min: 4});
        req.check("confpass", "Enter a valid confirm password.").equals(pass);

        let errors = req.validationErrors();
        if (errors){
            req.session.errors = errors;
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


