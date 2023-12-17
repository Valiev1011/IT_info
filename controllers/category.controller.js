const { json } = require("express");
const { default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Category = require("../models/category");
const { categoryValidation } = require("../validations/category");

const getAllCategories = async (req, res) => {
  try {
    const category = await Category.find({});
    console.log(category);
    // console.log(json(category));
    if (!category) {
      return res.status(400).send({ message: "Categories not found" });
    }
    res.json({ category });
  } catch (error) {
    errorHandler(res, error);
  }
};

const addCategory = async (req, res) => {
  try {
    const { error, value } = categoryValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const { category_name, parent_category_id } = req.body;
    const category = await Category.findOne({
      category_name: { $regex: category_name, $options: "i" },
    });
    if (category) {
      return res
        .status(400)
        .send({ message: "Bunday categoryin avval kiritilgan" });
    }
    const newCategory = await Category({
      category_name,
      parent_category_id,
    });
    await newCategory.save();
    res.status(200).send({ message: "Yangi categoryin qo'shildi" });
  } catch (error) {
    errorHandler(res, error);
  }
};
const updateCategoryById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "Incorrect ID" });
    }
    const id = req.params.id;
    console.log(id);
    const { category_name, parent_category_id } = req.body;
    console.log(category_name, parent_category_id);
    const field = {
      $set: {
        category_name,
        parent_category_id,
      },
    };
    const categorys = await Category.findByIdAndUpdate(id, field);
    console.log(categorys);
    await res.json({ message: "updated successfully" });
  } catch (error) {
    errorHandler(res, error);
  }
};
const getCategoryByLetter = async (req, res) => {
  try {
    const letter = req.params.letter;
    const categorys = await Category.find({ letter });

    if (!categorys) {
      return res.status(400).send({ message: "Birorta categoryin topilmadi" });
    }
    res.json({ categorys });
  } catch (error) {
    errorHandler(res, error);
  }
};
const getCategoryById = async (req, res) => {
  try {
    const id = req.params.body;
    const user = await Category.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(400).send({ message: "Categories not found" });
    }
    res.json({ user });
  } catch (error) {
    errorHandler(res, error);
  }
};
const getCategoryByName = async (req, res) => {
  try {
    const category = req.params.category;
    const categorys = await Category.findOne({ category: category });
    if (!category) {
      return res.status(400).send({ message: "Categories not found" });
    }
    res.json({ categorys });
  } catch (error) {
    errorHandler(res, error);
  }
};
const deleteCategoryById = async (req, res) => {
  try {
    const id = req.params.body;
    const user = await Category.deleteOne({ _id: req.params.id });
    if (!user) {
      return res.status(400).send({ message: "Categories not found" });
    }
    res.json({ user });
  } catch (error) {
    errorHandler(res, error);
  }
};
module.exports = {
  addCategory,
  getAllCategories,
  getCategoryByLetter,
  getCategoryById,
  getCategoryByName,
  deleteCategoryById,
  updateCategoryById,
};
