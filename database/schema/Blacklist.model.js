const { Schema, model } = require("mongoose");

const Blacklist = new Schema({
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
        type: Date,
        default: Date.now
    }
});

module.exports = model('Blacklist', Blacklist);