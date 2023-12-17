const { json } = require("express");
const { default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Description = require("../models/description");

const getAllDescription = async (req, res) => {
  try {
    const description = await Description.find({}).populate("category_id");
    // console.log(json(description));
    if (!description) {
      return res.status(400).send({ message: "Description not found" });
    }
    res.send(description);
  } catch (error) {
    errorHandler(res, error);
  }
};

const addDescription = async (req, res) => {
  try {
    const { category_id, description } = req.body;
    const dict = await Description.findOne({
      description: { $regex: description, $options: "i" },
    });
    if (dict) {
      return res
        .status(400)
        .send({ message: "Bunday description avval kiritilgan" });
    }
    const newDescription = await Description({
      category_id,
      description,
    });
    await newDescription.save();
    res.status(200).send({ message: "Yangi description qo'shildi" });
  } catch (error) {
    errorHandler(res, error);
  }
};
const updateDescriptionById = async (req, res) => {
  try {
    const id = req.params.id;
    const { category_id, description } = req.body;
    const descriptions = await Description.findByIdAndUpdate(id, {
      category_id,
      description,
    });
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "Incorrect ID" });
    }
    res.json({ message: "updated successfully" });
  } catch (error) {
    errorHandler(res, error);
  }
};
// const getDescriptionByLetter = async (req, res) => {
//   try {
//     const letter = req.params.letter;
//     const descriptions = await Description.find({ letter });

//     if (!descriptions) {
//       return res
//         .status(400)
//         .send({ message: "Birorta descriptionin topilmadi" });
//     }
//     res.json({ descriptions });
//   } catch (error) {
//     errorHandler(res, error);
//   }
// };
const getDescriptionById = async (req, res) => {
  try {
    const id = req.params.body;
    const description = await Description.findOne({ _id: req.params.id });
    if (!description) {
      return res.status(400).send({ message: "Description not found" });
    }
    res.json({ description });
  } catch (error) {
    errorHandler(res, error);
  }
};
// const getDescriptionByName = async (req, res) => {
//   try {
//     const description = req.params.description;
//     const descriptions = await Description.findOne({
//       description: description,
//     });
//     if (!description) {
//       return res.status(400).send({ message: "Description not found" });
//     }
//     res.json({ descriptions });
//   } catch (error) {
//     errorHandler(res, error);
//   }
// };
const deleteDescriptionById = async (req, res) => {
  try {
    const id = req.params.body;
    const description = await Description.deleteOne({ _id: req.params.id });
    if (!description) {
      return res.status(400).send({ message: "Description not found" });
    }
    res.json({ description });
  } catch (error) {
    errorHandler(res, error);
  }
};
module.exports = {
  addDescription,
  getAllDescription,
  // getDescriptionByLetter,
  getDescriptionById,
  // getDescriptionByName,
  deleteDescriptionById,
  updateDescriptionById,
};
