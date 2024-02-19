const mongoose = require("mongoose");

const MONGO_URI =
  "mongodb+srv://merlinlibinmerlin:Merlinlibin96@cluster0.yhttcco.mongodb.net/MUSIC_APP";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err.message);
  });
