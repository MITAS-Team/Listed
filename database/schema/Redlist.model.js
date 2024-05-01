const { Schema, model } = require("mongoose");

const Redlist = new Schema({
    userID: {
        // User ID
        type: String,
        required: true,
        unique: false 
    },
    guilds: [
        {
            ID: {
                // Guild ID
                type: String,
                required: true,
                unique: true
            },
            reason: {
                // Reason for redlisting the user in this guild
                type: String,
                required: true,
                 unique: false
            },
            executedBy: {
                type: String,
                required: true,
                 unique: false
            }
        }
    ],
    Timestamp: {
        // Timestamp when the user was redlisted
        type: Date,
        default: Date.now
    }
});

module.exports = model('Redlist', Redlist);