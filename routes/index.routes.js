const { Router } = require("express");
const express = require("express");

express.Router.prefix = function (path, subRouter) {
  const router = express.Router();
  this.use(path, router);
  subRouter(router);
  return router;
};

const router = Router();
router.prefix("/api", (apiRouter) => {
  apiRouter.use("/category", require("./category.routes"));
  apiRouter.use("/dictionary", require("./dictionary.routes"));
  apiRouter.use("/description", require("./description.routes"));
  apiRouter.use("/synonym", require("./synonym.routes"));
  apiRouter.use("/author", require("./author.routes"));
  apiRouter.use("/admin", require("./admin.routes"));
  apiRouter.use("/user", require("./user.routes"));
});
router.use("/", require("./view.routes"));

module.exports = router;
