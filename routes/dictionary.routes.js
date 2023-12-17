const { Router } = require("express");
const {
  getAllTerms,
  addTerm,
  getTermById,
  updateTermById,
  getTermsByTerm,
  deleteTermById,
} = require("../controllers/dictionary.controller");

const router = Router();

router.get("/", getAllTerms);
router.post("/", addTerm);
router.get("/:id", getTermById);
router.put("/:id", updateTermById);
router.get("/term/:term", getTermsByTerm);
router.delete("/:id", deleteTermById);

module.exports = router;
