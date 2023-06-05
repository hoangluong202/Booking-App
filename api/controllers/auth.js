import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

/**
 * Register function to registry account(email,username,password)
 * Hash password and save it in to DB
 * Catch error or response User has been created
 */
export const register = async (req, res, next) => {
  try {
    /**Hashing password */
    const salt = bcrypt.genSaltSync(10); //create random salt value with round is 10
    const hash = bcrypt.hashSync(req.body.password, salt); //hash password with key is salt value

    /**Create User Models from request */
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash, //password has been hash
    });

    /**Save information of new User(username,password(hashed),email) on mongoDB */
    await newUser.save();

    /**Response status and send inf */
    res.status(200).send("User has been created");
  } catch (err) {
    /**Catch err and goto middlewares process err in index.js */
    next(err);
  }
};

/**
 * Login function: check username and password to login
 */
export const login = async (req, res, next) => {
  try {
    /**In database User, find one user with username is from request and save in user
     * If not find, use middlewares error handler to response(index.js)
     */
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found"));

    /**Use bcrypt lib to compare(plain text, hash)
     * If diff -> middleware error handler in index.js
     */
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username"));

    /**
     * Generate token with payload(id and isAdmin) + secret: JWT ENV
     * Sign with default alg: SHA256
     */
    const token = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.JWT
    );

    /**
     * tech to send json without isAdmin and password
     */
    const { isAdmin, password, ...otherDetails } = user._doc;

    res
      .cookie("access-token", token, { httpOnly: true })
      .status(200)
      .json({ ...otherDetails });
  } catch (err) {
    next(err);
  }
};
