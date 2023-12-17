const Joi = require("joi");

const Adminschema = Joi.object({
  admin_name: Joi.string()
    .pattern(new RegExp("^[a-z A-Z]{2,50}$"))
    .required()
    .trim(),
  admin_email: Joi.string().email(),
  admin_password: Joi.string().required().trim().max(20).min(6),
  admin_is_active: Joi.boolean().required().default(false),
  admin_is_creator: Joi.boolean().required().default(false),
});

module.exports = Adminschema;
