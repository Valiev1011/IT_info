const { Router } = require("express");
const {
  getAllCategories,
  addCategory,
  getCategoryById,
  updateCategoryById,
  getCategoryByName,
  deleteCategoryById,
} = require("../controllers/category.controller");

const router = Router();

router.get("/", getAllCategories);
router.post("/", addCategory);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategoryById);
router.get("/name/:name", getCategoryByName);
router.delete("/:id", deleteCategoryById);

module.exports = router;
