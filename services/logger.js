const config = require("config");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, prettyPrint, json, colorize } = format;
require("winston-mongodb");
const express = require("express");
const mongoose = require("mongoose");

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp}  ${level}: ${message}`;
});

let logger;
const devlog = createLogger({
  format: combine(timestamp(), myFormat),
  transports: [
    new transports.Console({ level: "debug" }),
    new transports.File({ filename: "log/error.log", level: "error" }),
    new transports.File({ filename: "log/combine.log", level: "info" }),
  ],
});
const prodlog = createLogger({
  format: combine(timestamp(), myFormat),
  transports: [
    new transports.File({ filename: "log/error.log", level: "error" }),
    new transports.MongoDB({
      db: config.get("atlasURI"),
      options: { useUnifiedTopology: true },
    }),
  ],
});

if (process.env.NODE_ENV == "production") {
  logger = prodlog;
} else {
  logger = devlog;
}

// if (process.env.NODE_ENV == "development") {
//   const logger = createLogger({
//     format: combine(timestamp(), myFormat),
//     // format: combine(colorize(), timestamp(), myFormat, prettyPrint(), json()),
//     transports: [
//       new transports.Console({ level: "debug" }),
//       new transports.Console({ level: "error" }),
//       new transports.Console({ level: "info" }),
//     ],
//   });
//   module.exports = logger;
// } else {
//   const logger = createLogger({
//     format: combine(timestamp(), myFormat),
//     // format: combine(colorize(), timestamp(), myFormat, prettyPrint(), json()),
//     transports: [
//       new transports.Console({ level: "debug" }),
//       new transports.Console({ level: "error" }),
//       // new transports.Console({ filename: "log/combine.log", level: "info" }),
//       new transports.MongoDB({
//         db: config.get("atlasURI"),
//         options: { useUnifiedTopology: true },
//       }),
//     ],
//   });
// }

// logger.exceptions.handle(
//   new transports.File({ filename: "log/exceptions.log" })
// );
// logger.rejections.handle(
//   new transports.File({ filename: "log/rejections.log" })
// );
// logger.exitOnError = false;

module.exports = logger;
