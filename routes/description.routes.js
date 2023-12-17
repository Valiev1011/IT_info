const { Router } = require("express");
const {
  getAllDescription,
  addDescription,
  getDescriptionById,
  updateDescriptionById,
  deleteDescriptionById,
} = require("../controllers/description");

const router = Router();

router.get("/", getAllDescription);
router.post("/", addDescription);
router.get("/:id", getDescriptionById);
router.put("/:id", updateDescriptionById);
// router.get("/term/:term", getTermsByTerm);
router.delete("/:id", deleteDescriptionById);

module.exports = router;
