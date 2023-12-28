import User from "../models/user.modal.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const updateUser = async (req, res, next) => {
  if (req.params.id !== req.user.id)
    return next(errorHandler(401, "Unortharized"));

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          photo: req.body.photo,
          password: req.body.password,
        },
      },
      {
        new: true,
      }
    );

    if (!user) {
      return next(errorHandler(404, "User is not available"));
    }

    const { password, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "Unortharized"));

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token").status(200).json("User has been deleted!");
  } catch (error) {
    next(error);
  }
};
