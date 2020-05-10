var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var Events = require('./models/events');
var Comment = require('./models/comments');
var passport = require('passport');
var localStratergy = require('passport-local');
var User = require('./models/user');
var methodOverride = require('method-override');
var flash = require('connect-flash');

// to connect to mongodb
mongoose.connect("mongodb://localhost/appy_net", {useNewUrlParser: true});

// to initialise body parser
app.use(bodyparser.urlencoded({extended: true}));

// to set the default html embedded engine to ejs
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

var eventRoutes = require('./routes/events');
var commentRoutes = require('./routes/comments');
var indexRoutes = require('./routes/index');

//config passport
app.use(require("express-session")({
    secret: 'Ruby on rails is better than node.js',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use(commentRoutes);
app.use("/events", eventRoutes);

app.listen(3000, function() {
    console.log( "AppyNet server has started");
    }
);