const { errorHandler } = require("../helpers/error_handler");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const config = require("config");
// const userValdation = require("../validations/user");
const { isValidObjectId } = require("mongoose");

const uuid = require("uuid");
const mailService = require("../services/MailService");
const myJwt = require("../services/JwtService");

exports.addNewUser = async (req, res) => {
  try {
    // const { error, value } = userValdation(req.body);
    // if (error) {
    //   return res.status(400).send({ message: error.details[0].message });
    // }
    const {
      user_name,
      user_email,
      user_password,
      user_is_active,
      user_photo,
      user_info,
    } = req.body;

    const user = await User.findOne({ user_email });
    if (user) {
      return res.status(400).send({ message: "Bunday user avval kiritilgan" });
    }

    const hashedPassword = bcrypt.hashSync(user_password, 7);
    const user_activation_link = uuid.v4();
    const result = new User({
      user_name,
      user_email,
      user_password: hashedPassword,
      user_is_active,
      user_photo,
      user_info,
      user_activation_link,
    });
    await result.save();
    console.log(result.user_activation_link, result.id);

    await mailService.sendActivationMail(
      user_email,
      `${config.get("api_url")}/api/user/activate/${user_activation_link}`
    );

    const payload = {
      id: result._id,
      // is_expert: result.is_expert,
      userRoles: ["READ", "WRITE"],
      user_is_active: result.user_is_active,
    };

    const tokens = myJwt.generateTokens(payload);
    result.user_token = tokens.refreshToken;
    await result.save();

    await result.save();
    res.status(200).send({ message: "Success!" });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.userActivate = async (req, res) => {
  try {
    const user = await User.findOne({
      user_activation_link: req.params.link,
    });
    console.log(user);
    if (!user) {
      return res.status(400).send({ message: "Bunday User topilmadi" });
    }
    if (user.user_is_active) {
      return res.status(400).send({ message: "User already activated" });
    }
    user.user_is_active = true;
    await user.save();
    res.status(200).send({
      user_is_active: user.user_is_active,
      message: "user activated",
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const result = await User.find();
    if (!result.length) {
      return res.status(404).send({ message: "No User found!" });
    }
    res.status(200).json({ users: result });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.getUserById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).send({ message: "Wrong User ID!" });
    }
    const result = await User.findById(req.params.id);
    if (!result) {
      return res.status(404).send({ message: "No User is found!" });
    }

    res.status(200).json({ user: result });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.updateUserById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "Wrong Object Id!" });
    }

    const { error, value } = userValdation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const {
      user_name,
      user_email,
      user_password,
      user_is_active,
      user_photo,
      user_info,
    } = value;

    const result = await User.updateOne(
      { _id: req.params.id },
      {
        $set: {
          user_name,
          user_email,
          user_password: bcrypt.hashSync(user_password, 7),
          user_is_active,
          user_photo,
          user_info,
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "User not found" });
    } else if (result.modifiedCount === 0) {
      return res.status(400).send({ message: "User already updated" });
    }
    console.log(result);

    res.status(200).send({ message: "User updated successfully" });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.loginUser = async (req, res) => {
  try {
    if (!user_password || !user_email) {
      return res
        .status(403)
        .send({ message: "Please enter user password and email address." });
    }

    const user = await User.findOne({ user_email });
    if (!user) {
      return res
        .status(400)
        .send({ message: "Invalid userization email or password " });
    }

    const validPassword = bcrypt.compareSync(user_password, user.user_password);

    if (!validPassword) {
      return res
        .status(400)
        .send({ message: "Invalid userization email or password " });
    }

    res.status(200).send({ message: "Welcome to User" });

    const { user_email, user_password } = req.body;
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "Wrong Object Id!" });
    }
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).send({ message: "User does not exist!" });
    }
    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    errorHandler(res, error);
  }
};
