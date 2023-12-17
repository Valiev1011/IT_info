const author_email_pass = require("./author_email_pass.validator");
const author = require("./author.validator");
const category = require("./category.validator");
const admin = require("./admin.validation");

module.exports = {
  author_email_pass,
  author,
  category,
  admin,
};
