var express = require('express');
var router = express.Router();
var Event = require('../models/events');
var Comment = require('../models/comments');
var middleWare = require('../middleware/index.js');

router.get('/events/:id/comments/new', middleWare.isLoggedIn, function(req,res){
    Event.findById(req.params.id, function(err,event) {
        if (err){
            console.log(err);
        } else {
            res.render("comments/new", {event: event});
        }
    });
});

router.post("/events/:id/comments", middleWare.isLoggedIn, function (req, res) {
    Event.findById(req.params.id, function (err, event) {
        if (err) {
            req.flash("error","OOPS!!! Something went wrong :-p");
            res.redirect('/events');
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    //add username to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    // save comment
                    event.comments.push(comment);
                    event.save();
                    req.flash("success","You successfully added a comment");
                    res.redirect('/events/' + event._id);
                }
            });
        }
    });
});

router.get("/events/:id/comments/:comment_id/edit", middleWare.checkCommentOwnerShip, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {event_id: req.params.id, comment: foundComment});
        }
    });
});

router.put("/events/:id/comments/:comment_id",middleWare.checkCommentOwnerShip, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/events/" + req.params.id);
        }
    });
});

router.delete("/events/:id/comments/:comment_id",middleWare.checkCommentOwnerShip, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/events/" + req.params.id);
        }
    })
});


module.exports = router;