require("dotenv").config();
// console.log("Gemini key loaded:", !!process.env.GEMINI_API_KEY);

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");//for authentication
var claimDocRouter = require("./routes/document");//document analysis
const claimRouter = require("./routes/claim");//calling agents

var app = express();

const uri =
  "mongodb+srv://nehadgp03_db_user:agentic@cluster0.jnrbgyz.mongodb.net/claimsathi_db";

async function connectDB() {
  mongoose.connect(uri, {});
  try {
    // await mongoose.connect(uri, {
    //   // useNewUrlParser: true,
    //   // useUnifiedTopology: true,
    // });
    console.log("connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
connectDB();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/claim", claimDocRouter);
app.use("/claim", claimRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
