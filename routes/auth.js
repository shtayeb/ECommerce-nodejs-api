const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
//register
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SECRET
    ).toString(),
  });
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // decrypt the password and compare it with the password in the request
    const decrypted = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SECRET.toString()
    ).toString(CryptoJS.enc.Utf8);

    if (decrypted === req.body.password) {
      //create a jwt token for the user
      const accessToken = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET,
        { expiresIn: "3d" }
      );

      // dont send the password to the client side
      const { password, ...others } = user._doc;
      res.status(200).json({
        accessToken,
        ...others,
      });
    } else {
      res.status(401).json({ message: "Incorrect password" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
