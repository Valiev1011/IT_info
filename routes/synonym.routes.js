const { Router } = require("express");
const {
  getAllSynonym,
  addSynonym,
  getSynonymById,
  updateSynonymById,
  deleteSynonymById,
} = require("../controllers/synonym.controller");

const router = Router();

router.get("/", getAllSynonym);
router.post("/", addSynonym);
router.get("/:id", getSynonymById);
router.put("/:id", updateSynonymById);
// router.get("/name/:name", getCategoryByName);
router.delete("/:id", deleteSynonymById);

module.exports = router;
