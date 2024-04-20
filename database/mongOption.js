const mongoose = require("mongoose");

module.exports = {
    init: (connect) => {
        mongoose.connect(connect);
        mongoose.Promise = global.Promise;

        // Send console message if connected to mongoDB
        mongoose.connection.on("connected", () => {
            console.log("\x1b[92m[mongoDB]: connected\x1b[0m");
        });

        // Send console message if mongoDB is disconected
        mongoose.connection.on("disconnected",() => {
            console.log("\x1b[31m[mongoDB]: disconnected\x1b[0m");
        });

        // Send error message if connection 
        mongoose.connection.on("error", (error) => {
            console.log("\x1b[31m[mongoDB]: An error occured\x1b[0m", error);
        });
    },
};
