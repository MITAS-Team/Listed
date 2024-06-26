const { Schema, model } = require("mongoose");

const Guild = new Schema({
    ID: {
        type: String,
        required: true,
        unique: true
    },
    Settings: {
        Logs: {
            type: Boolean,
            default: false
        },
        LogChannel: {
            type: String,
            required: true
        }
    },
    Timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = model("Guild", Guild);
