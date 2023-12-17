const { Router } = require("express");
const {
  getAllUser,
  addNewUser,
  getUserById,
  updateUserById,
  deleteUserById,
  userActivate,
} = require("../controllers/user.controller");

const router = Router();

router.get("/", getAllUser);
router.post("/", addNewUser);
router.get("/:id", getUserById);
router.put("/:id", updateUserById);
router.get("/activate/:link", userActivate);

router.delete("/:id", deleteUserById);

module.exports = router;
