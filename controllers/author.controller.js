const { errorHandler } = require("../helpers/error_handler");
const Author = require("../models/author");
const { authorValidation } = require("../validations/author.validation");
// const jwt = require("jsonwebtoken");
const config = require("config");
const uuid = require("uuid");
const mailService = require("../services/MailService");

const myJwt = require("../services/JwtService");

// const generateAccessToken = (id, is_expert, authorRoles) => {
//   const payload = {
//     id,
//     is_expert,
//     authorRoles,
//   };
//   return jwt.sign(payload, config.get("secret"), { expiresIn: "1h" });
// };

const bcrypt = require("bcrypt");

const getAllAuthor = async (req, res) => {
  try {
    const author = await Author.find({});
    // console.log(json(author));
    if (!author) {
      return res.status(400).send({ message: "Author not found" });
    }
    res.json({ data: author });
  } catch (error) {
    errorHandler(res, error);
  }
};

const addAuthor = async (req, res) => {
  try {
    const {
      author_first_name,
      author_last_name,
      author_nick_name,
      author_password,
      author_email,
      author_phone,
      author_info,
      author_position,
      author_photo,
      is_expert,
    } = req.body;
    const author = await Author.findOne({ author_email });
    if (author) {
      return res
        .status(400)
        .send({ message: "Bunday authori avval kiritilgan" });
    }
    const hashedPassword = await bcrypt.hash(author_password, 7);
    const author_activation_link = uuid.v4();

    const newAuthor = await Author({
      author_first_name,
      author_last_name,
      author_nick_name,
      author_password: hashedPassword,
      author_email,
      author_phone,
      author_info,
      author_position,
      author_photo,
      is_expert,
      author_activation_link,
    });
    await newAuthor.save();

    await mailService.sendActivationMail(
      author_email,
      `${config.get("api_url")}/api/author/activate/${author_activation_link}`
    );

    const payload = {
      id: newAuthor._id,
      is_expert: newAuthor.is_expert,
      authorRoles: ["READ", "WRITE"],
      author_is_active: newAuthor.author_is_active,
    };

    const tokens = myJwt.generateTokens(payload);
    newAuthor.author_token = tokens.refreshToken;
    await newAuthor.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      // httpOnly: true,
    });

    res.status(200).send({ message: "Yangi authori qo'shildi" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const authorActivate = async (req, res) => {
  try {
    const author = await Author.findOne({
      author_activation_link: req.params.link,
    });
    if (!author) {
      return res.status(400).send({ message: "Bunday Avtor topilmadi" });
    }
    if (author.author_is_active) {
      return res.status(400).send({ message: "User already activated" });
    }
    author.author_is_active = true;
    await author.save();
    res.status(200).send({
      author_is_active: author.author_is_active,
      message: "user activated",
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateAuthorById = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      author_first_name,
      author_last_name,
      author_nick_name,
      author_password,
      author_email,
      author_phone,
      author_info,
      author_position,
      author_photo,
      is_expert,
    } = req.body;
    const authors = await Author.findByIdAndUpdate(id, {
      author_first_name,
      author_last_name,
      author_nick_name,
      author_password,
      author_email,
      author_phone,
      author_info,
      author_position,
      author_photo,
      is_expert,
    });
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "Incorrect ID" });
    }
    res.json({ message: "updated successfully" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const loginAuthor = async (req, res) => {
  try {
    const { author_email, author_password } = req.body;
    const author = await Author.findOne({ author_email });
    if (!author) {
      return res.status(400).send({ message: "Email yoki parol noto'g'ri" });
    }
    const validPassword = await bcrypt.compare(
      author_password, //Frontdan kelgan ochiq password
      author.author_password //bazadan olingan hashlangan password
    );
    if (!validPassword) {
      return res.status(400).send({ message: "Email yoki parol noto'g'ri" });
    }

    const payload = {
      id: author._id,
      is_expert: author.is_expert,
      authorRoles: ["READ", "WRITE"],
    };
    const tokens = myJwt.generateTokens(payload);
    // console.log(tokens);
    // const token = generateAccessToken(author._id, author.is_expert, [
    //   "READ",
    //   "WRITE",
    // ]);

    author.author_token = tokens.refreshToken;
    await author.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      // httpOnly: true,
    });

    // try {
    //   setTimeout(() => {
    //     var err = new Error("Hello");
    //     throw err;
    //   }, 1000);
    // } catch (err) {
    //   console.log(err);
    // }

    // new Promise((_, reject) => reject(new Error("woops1")));

    res.status(200).send({ ...tokens });
  } catch (error) {
    errorHandler(res, error);
  }
};

const logoutAuthor = async (req, res) => {
  const { refreshToken } = req.cookies;
  let author;
  if (!refreshToken)
    return res.status(400).send({ message: "Token topilmadi" });
  author = await Author.findOneAndUpdate(
    { author_token: refreshToken },
    { author_token: "" },
    { new: true }
  );
  if (!author) return res.statsu(400).send({ message: "Token topilmadi" });
  res.clearCookie("refreshToken");
  res.status(200).send({ author });
};

const refreshAuthorToken = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken)
    return res.status(400).send({ message: "Token topilmadi" });
  const authorDataFromCookie = await myJwt.verifyRefresh(refreshToken);

  const authorDataFromDB = await Author.findOne({ author_token: refreshToken });
  if (!authorDataFromCookie || !authorDataFromDB) {
    return res.status(400).send({ message: "Author ro'yxatdan o'tmagan" });
  }
  const author = await Author.findById(authorDataFromCookie.id);
  if (!author) return res.status(400).send({ message: "ID noto'g'ri" });

  const payload = {
    id: author._id,
    is_expert: author.is_expert,
    authorRoles: ["READ", "WRITE"],
  };
  const tokens = myJwt.generateTokens(payload);
  author.author_token = tokens.refreshToken;
  await author.save();
  res.cookie("refreshToken", tokens.refreshToken, {
    maxAge: config.get("refresh_ms"),
    // httpOnly: true,
  });
  res.status(200).send({ ...tokens });
};

const getAuthorById = async (req, res) => {
  try {
    const id = req.params.id;
    if (id !== req.author.id) {
      return res.status(401).send({ message: "Sizda bunday huquq yo'q" });
    }

    const user = await Author.findById(id);
    if (!user) {
      return res.status(400).send({ message: "Author not found" });
    }
    res.json({ user });
  } catch (error) {
    errorHandler(res, error);
  }
};
// const getAuthorByName = async (req, res) => {
//   try {
//     const author = req.params.author;
//     const authors = await Author.findOne({ author: author });
//     if (!author) {
//       return res.status(400).send({ message: "Author not found" });
//     }
//     res.json({ authors });
//   } catch (error) {
//     errorHandler(res, error);
//   }
// };
const deleteAuthorById = async (req, res) => {
  try {
    const id = req.params.id;
    if (id !== req.author.id) {
      return res.status(401).send({ message: "Sizda bunday huquq yo'q" });
    }

    const result = await Author.findOne({ _id: id });
    if (result == null) {
      return res.status(400).send({ message: "Id is incorrect" });
    }

    await Author.findByIdAndDelete(id);
    res.status(200).send({ message: "OK. Author is deleted" });
  } catch (error) {
    errorHandler(res, error);
  }
};
module.exports = {
  refreshAuthorToken,
  addAuthor,
  getAllAuthor,
  loginAuthor,
  // getAuthorByLetter,
  getAuthorById,
  // getAuthorByName,
  deleteAuthorById,
  updateAuthorById,
  logoutAuthor,
  authorActivate,
};
