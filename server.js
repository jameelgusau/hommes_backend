require("rootpath")();
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandler = require('./errors')

app.use(cookieParser());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// const fileUpload = require('express-fileupload');

// default options
// app.use(fileUpload());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
// allow cors requests from any origin and with credentials
app.use(
  cors({
    // origin: (origin, callback) => callback(null, true),
    origin: ['http://localhost:3000', 'http://localhost:3001', 'https://wonderful-platypus-c1e268.netlify.app'],
    credentials: true,
  })
);
// var corsOptions = {
//   origin: ['http://localhost:3000', 'https://easytalkchat.netlify.app'],
//   credentials: true,
// };
// api routes
app.use("/api", require("./routes"));
app.use("/back", require("./routes/backdoor.routes"));

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`);
});