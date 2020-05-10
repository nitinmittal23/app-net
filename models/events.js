var mongoose = require("mongoose");

var eventSchema = new mongoose.Schema({

    // database blueprint
    name: String,
    image: String,
    description: String,
    date: {
        type: mongoose.Schema.Types.Date
    },
    Link: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

module.exports = mongoose.model("Events", eventSchema);