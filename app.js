/**
 * Module dependencies.
 */
var express = require('express')
    , stripe = require("stripe")("sk_test_FVg7n3n3FHizeJeDRMy4Xx4g")
    , routes = require('./routes')
    , user = require('./routes/user')
    , admin = require('./routes/admin')
    , validator = require('express-validator')
    , http = require('http')
    , path = require('path');
//var methodOverride = require('method-override');
const saltRounds = 10;
var app = express();
var mysql      = require('mysql');
var bodyParser=require("body-parser");
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'user',
    password : 'qa123123',
    database : 'node_cubex'
});
var session = require('express-session');

connection.connect();

global.db = connection;

// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 6000000000000 }
}));
app.use(validator());


app.get('/', routes.index);//call for main index page
app.get('/login', isAUth,user.index);//call for login page
app.get('/signup', user.signup);//call for signup page
app.post('/login',isAUth, user.login);//call for login post
app.post('/signup', user.signup);//call for signup post
app.get('/logout', user.logout);//call for user logout

app.get('/home/dashboard', user.dashboard);//call for dashboard page after login
app.post('/home/dashboard', user.buy);//call for user buying(stripe)
app.get('/home/orders', user.orders);//call for cart page

//app.post('/charge', functio(req, res){ )

app.get('/admin/index', admin.products);//call for admin area page after login
app.post('/admin/index', admin.productDel);//call for delete product
app.get('/admin/product/add', admin.productAdd);//call for admin/product/add page
app.post('/admin/product/add', admin.productSave);


app.use(function(req, res){
    res.status(404).send("Page Not Found Sorry")
});

//Middleware
app.listen(8080, ()=>{
    console.log(`server running on port 8080`)
})

function isAUth(req,res,next) {
    if(req.session.user){
        res.redirect('back');
    }
    else{
        next();
    }

}