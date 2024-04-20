const { Schema, model } = require("mongoose");

const Blacklist = new Schema({
    userID: {
        type: String,
        required: true,
        unique: true
    },
    reason: {
        type: String,
        required: true
    }
});

module.exports = model('Blacklist', Blacklist);