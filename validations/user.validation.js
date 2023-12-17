const Joi = require("joi");

exports.Userschema = Joi.object({
  user_name: Joi.string()
    .pattern(new RegExp("^[a-z A-Z]{2,50}$"))
    .required()
    .trim(),
  user_email: Joi.string().email(),
  user_password: Joi.string().required().trim().max(20).min(6),
  user_is_active: Joi.boolean().required().default(false),
  user_photo: Joi.string().required().trim(),
  user_info: Joi.string(),
});
