const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  DOB: {
    type: Date,
    required: true,
  },
  likedSongs: [
    {
      id: {
        type:Number
      },
      mp3: {
        type: String,
      },
      song_title: {
        type: String,
      },
      song_artist: {
        type: String,
      },
      song_thumbnail: {
        type: String,
      },
    },
  ],
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
