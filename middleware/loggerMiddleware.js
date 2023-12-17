const router = require("express").Router();
const express = require("express");
const { createLogger, format, transports } = require("winston");
const expressWinston = require("express-winston");
const winston = require("winston");
const config = require("config");

const { combine, timestamp, printf, prettyPrint, json, colorize, metadata } =
  format;

const expressWinstonlogger = expressWinston.logger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true,
    }),
  ],
  format: combine(timestamp(), prettyPrint(), json(), metadata()),
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false,
  ignoreRoute: function (req, res) {
    return false;
  },
});

const expressWinstonError = expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true,
    }),
  ],
  format: winston.format.combine(winston.format.json()),
});

module.exports = {
  expressWinstonlogger,
  expressWinstonError,
};
