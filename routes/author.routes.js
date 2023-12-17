const { Router } = require("express");
const {
  getAllAuthor,
  addAuthor,
  getAuthorById,
  updateAuthorById,
  deleteAuthorById,
  loginAuthor,
  logoutAuthor,
  refreshAuthorToken,
  authorActivate,
} = require("../controllers/author.controller");

const authorPolice = require("../middleware/authorPolice");
const authorRolesPolice = require("../middleware/authorRolesPolice");
const Validator = require("../middleware/validator");

const router = Router();

router.get("/", authorPolice, getAllAuthor);

router.post("/", Validator("author"), addAuthor);
router.get(
  "/:id",

  authorPolice,
  getAuthorById
);
router.put("update/:id", authorPolice, updateAuthorById);
router.post("/login", Validator("author_email_pass"), loginAuthor);
router.post("/logout", logoutAuthor);
router.post("/refresh", refreshAuthorToken);
router.get("/activate/:link", authorPolice, authorActivate);
router.delete("/delete/:id", authorPolice, deleteAuthorById);

module.exports = router;
