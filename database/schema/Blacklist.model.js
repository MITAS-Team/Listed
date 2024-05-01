const { Schema, model } = require("mongoose");

const Blacklist = new Schema({
    executedBy: {
        ID: {
            type: String,
            required: true
        },
        Tag: {
            type: String,
            required: true
        }
    },
    user: {
        ID: {
            // User ID
            type: String,
            required: true,
        },
        Tag: {
            // User Tag
            type: String,
            required: true
        }
    
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
                required: true
            }
        }
    ],
    reason: {
        type: String,
        required: true
    },
    Timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('Blacklist', Blacklist);