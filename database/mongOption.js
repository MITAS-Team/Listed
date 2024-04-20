const mongoose = require("mongoose");

module.exports = {
    init: (connect) => {
        mongoose.connect(connect);
        mongoose.Promise = global.Promise;

        // Send console message if connected to mongoDB
        mongoose.connection.on("connected", () => {
            console.log("[mongoDB]: connected");
        });

        // Send console message if mongoDB is disconected
        mongoose.connection.on("disconnected",() => {
            console.log("[mongoDB]: disconnected");
        });

        // Send error message if connection 
        mongoose.connection.on("error", (error) => {
            console.log("[mongoDB]: An error occured", error);
        });
    },
};
