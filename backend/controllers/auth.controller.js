import getToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = getToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true, 
    });

    const { password: pwd, ...userData } = user._doc;
    return res.status(201).json(userData);

  } catch (error) {
    return res.status(500).json({ message: `SignUp error: ${error.message}` });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ message: "Email does not exist!" });
    }

    const isMatch = await bcrypt.compare(password, userExist.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password!" });
    }

    const token = getToken(userExist._id);

    console.log("Generated token:", token);
    console.log("Token type:", typeof token);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    });

    const { password: pwd, ...userData } = userExist._doc;
    return res.status(200).json(userData);

  } catch (error) {
    return res.status(500).json({ message: `Login error: ${error.message}` });
  }
};



export const logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out!" });
  } catch (error) {
    return res.status(500).json({ message: `Logout error: ${error.message}` });
  }
};

