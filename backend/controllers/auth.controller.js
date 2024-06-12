import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import catchHandler from "../utils/handleCatchError.js";

export const signup = async (req, res) => {
  try {
    const { fullName, userName, password, confirmPassword, gender } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({
        error: "passwords do not match",
      });
    }
    const user = await User.findOne({ userName });
    if (user) {
      return res.status(200).json({
        error: "username already exists",
      });
    }

    // Hash password here
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${userName}`;

    const newUser = new User({
      fullName,
      userName,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    if (newUser) {
      await newUser.save();
      generateTokenAndSetCookie(newUser._id, res);
      const userData = {
        _id: newUser._id,
        fullName: newUser.fullName,
        userName: newUser.userName,
        profilePic: newUser.profilePic,
      };
      res.status(201).json(userData);
    } else {
      return res.status(400).json({ error: "invalid user data" });
    }
  } catch (err) {
    catchHandler(err, "signup", res);
  }
};

export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const foundUser = await User.findOne({ userName });
    if (!foundUser) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    generateTokenAndSetCookie(foundUser._id, res);

    res.status(200).json({
      _id: foundUser._id,
      fullName: foundUser.fullName,
      userName: foundUser.userName,
      profilePic: foundUser.profilePic,
    });
  } catch (err) {
    catchHandler(err, "login", res);
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).send({ message: "logged out successfully" });
  } catch (err) {
    catchHandler(err, "logout", res);
  }
};
