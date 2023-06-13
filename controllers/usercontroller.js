import { User } from "../models/usermodel.js";
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/features.js";
import ErrorHandler from "../middlewares/error.js";
// import multer from "multer";
// import path from "path"
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) return next(new ErrorHandler("Invalid Email or Password", 400));

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return next(new ErrorHandler("Invalid Email or Password", 400));

    sendCookie(user, res, `Welcome back, ${user.name}`, 200);
  } catch (error) {
    next(error);
  }
};
export const register = async (req, res,next) => {

  try {
    const { name, email, password} = req.body;
    let user = await User.findOne({ email });
    if (user) return next(new ErrorHandler("User Already Exist", 400));

  
    const salt = await bcrypt.genSalt(10);
  
    // Hash the password with the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({ name, email, password: hashedPassword});
    
    sendCookie(user, res, "Registered Successfully", 201);
  }
 catch (error) {

    next(error);
  }
};

export const logout = (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()+ 24 * 60 * 60 * 1000),
      sameSite: process.env.NODE_ENV === "Develpoment" ? "lax" : "none",
      secure: process.env.NODE_ENV === "Development" ? false : true,
    })
    .json({
      success: true,
      user:req.user,
    });
};