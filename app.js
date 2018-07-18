/**
 * Module dependencies.
 */
var express = require('express')
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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));
app.use(validator());


app.get('/', routes.index);//call for main index page
app.get('/login', user.index);//call for login page
app.get('/signup', user.signup);//call for signup page
app.post('/login', user.login);//call for login post
app.post('/signup', user.signup);//call for signup post
app.get('/logout', user.logout);//call for user logout
app.get('/home/dashboard', user.dashboard);//call for dashboard page after login
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

