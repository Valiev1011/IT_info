const { errorHandler } = require("../helpers/error_handler");
const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const adminValdation = require("../validations/admin.validation");
const { isValidObjectId } = require("mongoose");

const myJwt = require("../services/JwtService");

exports.addNewAdmin = async (req, res) => {
  try {
    const { error, value } = adminValdation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const {
      admin_name,
      admin_email,
      admin_password,
      admin_is_active,
      admin_is_creator,
    } = value;

    const hashedPassword = bcrypt.hashSync(admin_password, 7);
    const result = new Admin({
      admin_name,
      admin_email,
      admin_password: hashedPassword,
      admin_is_active,
      admin_is_creator,
    });

    await result.save();
    res.status(200).send({ message: "Success!" });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.getAllAdmin = async (req, res) => {
  try {
    const result = await Admin.find();
    if (!result.length) {
      return res.status(404).send({ message: "No Admin found!" });
    }
    res.status(200).json({ admins: result });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.getAdminById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).send({ message: "Wrong Admin ID!" });
    }
    const result = await Admin.findById(req.params.id);
    if (!result) {
      return res.status(404).send({ message: "No Admin is found!" });
    }

    res.status(200).json({ admin: result });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.updateAdminById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "Wrong Object Id!" });
    }

    const { error, value } = adminValdation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const {
      admin_name,
      admin_email,
      admin_password,
      admin_is_active,
      admin_is_creator,
    } = value;
    const hashedPassword = bcrypt.hashSync(admin_password, 7);
    const result = new Admin({
      admin_name,
      admin_email,
      admin_password: hashedPassword,
      admin_is_active,
      admin_is_creator,
    });

    console.log(result);

    res.status(200).send("Successfully updated, id :" + result._id);
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { admin_email, admin_password } = req.body;
    if (!admin_password || !admin_email) {
      return res
        .status(403)
        .send({ message: "Please enter admin password and email address." });
    }

    const admin = await Admin.findOne({ admin_email });
    if (!admin) {
      return res
        .status(400)
        .send({ message: "Invalid authorization email or password " });
    }

    const validPassword = bcrypt.compareSync(
      admin_password,
      admin.admin_password
    );

    if (!validPassword) {
      return res
        .status(400)
        .send({ message: "Invalid authorization email or password " });
    }

    res.status(200).send({ message: "Welcome to Admin" });
    
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.deleteAdminById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "Wrong Object Id!" });
    }
    const result = await Admin.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).send({ message: "Admin does not exist!" });
    }
    res.status(200).send({ message: "Admin deleted successfully" });
  } catch (error) {
    errorHandler(res, error);
  }
};
