require("dotenv").config();
const express = require("express");
const app = express();
const apiRouter = require("./api");
const morgan = require("morgan");
const cors = require("cors");

// Setup your Middleware and API Router here
app.use("/api", apiRouter);
app.use(morgan("dev"));
app.use(cors());

module.exports = app;
