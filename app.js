var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var Events = require('./models/events');
var Comment = require('./model/comments');
var passport = require('passport');
var localStratergy = require('passport-local');
var User = require('./models/user');
var methodOverride = require('method-override');
var flash = require('connect-flash');

// to connect to mongodb
mongoose.connect("mongodb://localhost/appy-net");

// to initialise body parser
app.use(bodyparser.urlencoded({extended: true}));

// to set the default html embedded engine to ejs
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.listen(1423, function() {
    console.log( "Appy-net server has started");
    }
);