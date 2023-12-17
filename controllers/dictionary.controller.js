const { default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Dictionary = require("../models/dictionary");

const getAllTerms = async (req, res) => {
  try {
    const dictionary = await Dictionary.find({});
    if (!dictionary) {
      return res.status(400).send({ message: "Dictionaries not found" });
    }
    res.send(dictionary);
  } catch (error) {
    errorHandler(res, error);
  }
};

const addTerm = async (req, res) => {
  try {
    const { term } = req.body;
    const dict = await Dictionary.findOne({
      term: { $regex: term, $options: "i" },
    });
    if (dict) {
      return res
        .status(400)
        .send({ message: "Bunday termin avval kiritilgan" });
    }
    const newTerm = await Dictionary({
      term,
      letter: term[0],
    });
    await newTerm.save();
    res.status(200).send({ message: "Yangi termin qo'shildi" });
  } catch (error) {
    errorHandler(res, error);
  }
};
const getTermByLetter = async (req, res) => {
  try {
    const letter = req.params.letter;
    const terms = await Dictionary.find({ letter });

    if (!terms) {
      return res.status(400).send({ message: "Birorta termin topilmadi" });
    }
    res.json({ terms });
  } catch (error) {
    errorHandler(res, error);
  }
};
const getTermById = async (req, res) => {
  try {
    const id = req.params.body;
    const dictionary = await Dictionary.findOne({ _id: req.params.id });
    if (!dictionary) {
      return res.status(400).send({ message: "Dictionaries not found" });
    }
    res.json({ dictionary });
  } catch (error) {
    errorHandler(res, error);
  }
};
const getTermsByTerm = async (req, res) => {
  try {
    const term = req.params.term;
    const terms = await Dictionary.findOne({ term: term });
    if (!term) {
      return res.status(400).send({ message: "Dictionaries not found" });
    }
    res.json({ terms });
  } catch (error) {
    errorHandler(res, error);
  }
};
const deleteTermById = async (req, res) => {
  try {
    const id = req.params.id;
    const dictionary = await Dictionary.findByIdAndDelete(req.params.id);
    if (!dictionary) {
      return res.status(400).send({ message: "Dictionaries not found" });
    }
    res.json({ dictionary });
  } catch (error) {
    errorHandler(res, error);
  }
};
const updateTermById = async (req, res) => {
  try {
    const id = req.params.id;
    const { term } = req.body;

    const dictionary = await Dictionary.findByIdAndUpdate(id, { term });
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "Incorrect ID" });
    }
    // await dictionary.save();
    res.json({ message: "updated successfully" });
  } catch (error) {
    errorHandler(res, error);
  }
};
module.exports = {
  addTerm,
  getAllTerms,
  getTermByLetter,
  getTermById,
  getTermsByTerm,
  deleteTermById,
  updateTermById,
};
