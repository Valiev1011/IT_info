const Joi = require("joi");

const Categoryschema = Joi.object({
  category_name: Joi.string()
    .min(2)
    .message("Kategoriya nomi 2 ta harfdan kam bo'lmasligi kerak")
    .max(255)
    .message("Kategoriya nomi 255ta harfdan uzun bo'lmasligi kerak!")
    .required(),

  parent_category_id: Joi.string().alphanum(),
});

module.exports = Categoryschema;
