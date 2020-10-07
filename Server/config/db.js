const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const connect = () =>
  mongoose.connect(
    "mongodb://localhost/gridTask",
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    () => {
      console.log("DB connected");
    },
    (err) => {
      console.log(err, "DB err");
    }
  );
module.exports = {
  connect,
};
