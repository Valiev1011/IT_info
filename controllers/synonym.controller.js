const { json } = require("express");
const { isValidObjectId, default: mongoose } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Synonym = require("../models/synonym");

const getAllSynonym = async (req, res) => {
  try {
    const synonym = await Synonym.find({})
      .populate("desc_id")
      .populate("dict_id");
    console.log(synonym);
    // console.log(json(synonym));
    if (!synonym) {
      return res.status(400).send({ message: "Synonym not found" });
    }
    res.json({ synonym });
  } catch (error) {
    errorHandler(res, error);
  }
};

const addSynonym = async (req, res) => {
  try {
    const { desc_id, dict_id } = req.body;
    if (
      !mongoose.isValidObjectId(desc_id) ||
      !mongoose.isValidObjectId(dict_id)
    ) {
      return res.status(404).send({ message: "not valid ObjectId" });
    }
    const newSynonym = await Synonym({
      desc_id,
      dict_id,
    });
    await newSynonym.save();
    res.status(200).send({ message: "Yangi synonymin qo'shildi" });
  } catch (error) {
    errorHandler(res, error);
  }
};
const updateSynonymById = async (req, res) => {
  try {
    const id = req.params.id;
    const synonyms = await Synonym.findByIdAndUpdate(id, {
      desc_id: desc_id,
      dict_id: dict_id,
    });
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "Incorrect ID" });
    }
    res.json({ message: "updated successfully" });
  } catch (error) {
    errorHandler(res, error);
  }
};
// const getSynonymByLetter = async (req, res) => {
//   try {
//     const letter = req.params.letter;
//     const synonyms = await Synonym.find({ letter });

//     if (!synonyms) {
//       return res.status(400).send({ message: "Birorta synonymin topilmadi" });
//     }
//     res.json({ synonyms });
//   } catch (error) {
//     errorHandler(res, error);
//   }
// };
const getSynonymById = async (req, res) => {
  try {
    const id = req.params.body;
    const synonym = await Synonym.findOne({ _id: req.params.id });
    if (!synonym) {
      return res.status(400).send({ message: "Synonym not found" });
    }
    res.json({ synonym });
  } catch (error) {
    errorHandler(res, error);
  }
};
// const getSynonymByName = async (req, res) => {
//   try {
//     const synonym = req.params.synonym;
//     const synonyms = await Synonym.findOne({ synonym: synonym });
//     if (!synonym) {
//       return res.status(400).send({ message: "Synonym not found" });
//     }
//     res.json({ synonyms });
//   } catch (error) {
//     errorHandler(res, error);
//   }
// };
const deleteSynonymById = async (req, res) => {
  try {
    const id = req.params.body;
    const synonym = await Synonym.findByIdAndDelete(req.params.id);
    if (!synonym) {
      return res.status(400).send({ message: "Synonym not found" });
    }
    res.json({ synonym });
  } catch (error) {
    errorHandler(res, error);
  }
};
module.exports = {
  addSynonym,
  getAllSynonym,
  // getSynonymByLetter,
  getSynonymById,
  // getSynonymByName,
  deleteSynonymById,
  updateSynonymById,
};
