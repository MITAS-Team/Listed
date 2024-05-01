const { Schema, model } = require("mongoose");

const Redlist = new Schema({
    executedBy: {
        ID: {
            // Id of the user who redlisted
            type: String,
            required: true,
            unique: false
        },
        Tag: {
            // Tag of the user who redlisted
            type: String,
            required: true
        }
    },
    user: {
        ID: {
            // User ID
            type: String,
            required: true,
            unique: false
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
    Timestamp: {
        // Timestamp when the user was redlisted
        type: Date,
        default: Date.now
    }
});

module.exports = model('Redlist', Redlist);