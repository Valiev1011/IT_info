const { Router } = require("express");
const {
  getAllAdmin,
  addNewAdmin,
  getAdminById,
  updateAdminById,
  deleteAdminById,
  loginAdmin,
} = require("../controllers/admin.controller");

const Validation = require("../middleware/validator");

const router = Router();

router.route("/").get(getAllAdmin).post(Validation("admin"), addNewAdmin);
router.get("/", getAllAdmin);
router.post("/", Validation("admin"), addNewAdmin);
router.get("/:id", getAdminById);
router.put("/:id", updateAdminById);
router.delete("/:id", deleteAdminById);
router.delete("/", loginAdmin);

module.exports = router;
