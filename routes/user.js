const express = require("express");
const User = require("../Models/User");
const { generateToken } = require("../Auth/generateToken");
const jsonWeb = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcryptjs");

router.post("/login", async (req, res) => {
  console.log(req.body);

  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });
    console.log(user);
    if (!user) {
      user = await User.findOne({ email: username });
    }

    if (!user) {
      return res.json({ success: false, message: "Invalid Credentials" });
    } else {
      const verify = await bcrypt.compare(password, user.password);
      if (!verify)
        return res.json({ success: false, message: "Invalid Credentials" });
      else {
        let token = await generateToken(user._id);
        console.log(token, user);

        return res.json({
          success: true,
          token,
          user,
          message: "login successful",
        });
      }
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
});

router.post("/register", async (req, res) => {
  console.log(req.body);
  const { email, username, password, DOB, gender } = req.body;

  if (!email || !username || !password || !DOB || !gender)
    return res.json({ success: false, message: "All fields are required" });
  try {
    let checkuser = await User.findOne({ email });
    console.log(checkuser);
    if (checkuser) {
      return res.json({ success: false, message: "user already exist" });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hash,
      DOB,
      gender,
    });
    console.log(User);
    if (user) {
      let token = await generateToken(user._id);

      console.log(token);
      res.json({ success: true, message: "User Created", user, token });
    } else {
      res.json({ success: false, message: "Some error creating Account" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "internal server error" });
  }
});
router.get("/me", async (req, res) => {
  try {
    const { token } = req.headers;
    if (!token)
      return res
        .status(401)
        .json({ success: true, message: "user Unauthorized" });

    const data = jsonWeb.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(data.id);
    if (user) {
      return res.json({ user, success: true, message: "user found" });
    } else {
      return res.status(404).json({ success: true, message: "user not found" });
    }
  } catch (error) {
    res.json({
      success: false,
      message: "session has expire please login again",
    });
  }
});
router.get("/users", async (req, res) => {
  const users = await User.find();
  res.json({ users, success: true, message: "users found" });
});

router.put("/like", async (req, res) => {
  try {
    const { song_mp3, song_title, song_artist, song_thumbnail, id } = req.body;

    const token = req.headers.token.slice(1, req.headers.token.length - 1);
    console.log(req.headers.token.slice(1, req.headers.token.length - 1));
    const data = jsonWeb.verify(token, process.env.JWT_SECRET);

    // Find theh User
    const user = await User.findById(data.id);

    console.log("user verification");

    if (user) {
      const likedSongs = user.likedSongs;
      console.log(likedSongs.length);

      const existingSong = likedSongs.find((song) => song.mp3 === song_mp3);

      if (existingSong) {
        // Song is already liked, so unlike it
        console.log("unliked song");
        user.likedSongs = likedSongs.filter((song) => song.mp3 !== song_mp3);
        user.save();
        return res.json({ user, success: true, message: "song unliked" });
      } else {
        // Song is not liked, so like it
        console.log("liked song");
        user.likedSongs.push({
          mp3: song_mp3,
          song_title,
          song_artist,
          song_thumbnail,
          id,
        });
        user.save();
        return res.json({ user, success: true, message: "song liked" });
      }
    } else {
      return res
        .status(404)
        .json({ success: false, message: "please login and continue" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
});

module.exports = router;
