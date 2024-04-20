const mongoose = require("mongoose");

module.exports = {
    init: (connect) => {
        mongoose.connect(connect);
        mongoose.Promise = global.Promise;
        mongoose.connection.on("connected", () => {
            console.log("Successfuly connected to mongoDB");
        });
    },
};
