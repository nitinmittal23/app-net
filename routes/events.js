var express = require('express');
var router = express.Router({mergeParams: true});
var Event = require('../models/events');
var Comment = require('../models/comments');
var middleWare = require('../middleware/index.js');

router.get("/", function (req, res) {
    // Find all the events from the DataBase
    Event.find({}, function (err, allEvents) {
        if (err) {
            console.log(err);
        } else {
            res.render("events/index", {events: allEvents, currentUser: req.user})
        }
    });
});

router.post("/", middleWare.isLoggedIn, function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var date = req.body.date;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newEvent = {name: name, image: image, description: desc,date: date, author: author};
    // Create a new Event with the database
    Event.create(newEvent, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/events");
        }
    });
    // events.push(newEvent);

});

// Show form to create new event
router.get("/new", middleWare.isLoggedIn, function (req, res) {
    res.render("events/new");
});

router.get("/:id", function (req, res) {
    Event.findById(req.params.id).populate("comments").exec(function (err, foundEvent) {
        if (err) {
            console.log(err);
        } else {
            res.render("events/show", {event: foundEvent});
        }
    })
});

// Edit event
router.get("/:id/edit",function (req, res) {
    if(req.isAuthenticated()){
        Event.findById(req.params.id, function (err, foundEvent) {
            if(err) {
                req.flash("error","OOPS!!! Something went wrong :-p");
                res.redirect("back");
            } else {
                if(foundEvent.author.id.equals(req.user._id)){
                    res.render("events/edit",{event: foundEvent});
                } else {
                    req.flash("error","You Don't Have Permissions To Do That");
                    res.redirect("back");
                }

            }
        });
    } else {
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }

});

// Update Event
router.put("/:id",middleWare.checkEventOwnerShip,function (req,res) {

    Event.findByIdAndUpdate(req.params.id,req.body.event,function (err,updatedEvent) {
        if(err){
            req.flash("error","OOPS!! Something Went Wrong. Please Try Again");
            res.redirect("/events");
        } else {
            req.flash("success","You successfully updated the event");
            res.redirect("/events/"+ req.params.id);
        }
    })
});

// Destroy
router.delete("/:id",middleWare.checkEventOwnerShip,function (req,res) {
    Event.findByIdAndRemove(req.params.id,function (err) {
        if(err){
            res.redirect("/events");
        } else {
            res.redirect("/events");
        }
    });
});

module.exports = router;