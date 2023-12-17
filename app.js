const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index.routes");
const cookieParser = require("cookie-parser");
const port = config.get("port") || 3333;

const exHbs = require("express-handlebars");

const errorHandler = require("./middleware/error_handling_middleware");

// const logger = require("./services/logger");

// const expressWinston = require("express-winston");
// const winston = require("winston");
// const {
//   expressWinstonlogger,
//   expressWinstonError,
// } = require("./middleware/loggerMiddleware");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

// console.log(process.env.NODE_ENV);
// console.log(process.env.secret);
// console.log(config.get("secret"));

// logger.log("info", "LOG ma'lumotlar");
// logger.error("ERROR ma'lumotlar");
// logger.debug("DEBUG ma'lumotlar");
// logger.warn("WARN ma'lumotlar");
// logger.info("INFO ma'lumotlar");

// logger.trace("TRACE ma'lumotlar");
// logger.table(["Salim", "Karim", "Nodir"]);
// logger.table([
//   ["Salim", "Karim", "Nodir"],
//   ["20", "24", "26"],
// ]);
// console.table([
//   ["Salim", "20"],
//   ["Karim", "24"],
//   ["Nodir", "26"],
// ]);

const app = express();

// process.on("uncaughtException", (ex) => {
//   console.log("uncaughtException:", ex.message);
// });

// process.on("unhandledRejection", (rej) => {
//   console.log("unhandledRejection:", rej);
// });

app.use(express.json());
app.use(cookieParser());

// app.use(expressWinstonlogger);

const hbs = exHbs.create({
  defaultLayout: "main",
  extname: "hbs",
});

app.engine("hbs", hbs.engine);

app.set("View engine", "hbs");
app.set("views", "views");
app.use(express.static("views"));

app.use(mainRouter);

// app.use(expressWinstonError);

app.use(errorHandler);

async function start() {
  try {
    await mongoose.connect(config.get("atlasURI"));
    app.listen(port, () => {
      console.log(`Server is running on ${port} port`);
    });
  } catch (error) {
    console.log(`Serverda xatolik`, error);
  }
}
start();
