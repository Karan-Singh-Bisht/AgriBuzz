require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const passport = require("./config");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

app.use(
  expressSession({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);
app.use(flash());

// Initialize Passport for authentication
app.use(passport.initialize());

// Enable persistent login sessions
app.use(passport.session());

//Middleware for flash

app.use((req, res, next) => {
  //res.locals allows us to use several things in ejs files
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

const db = require("./config/db");
db();

app.set("view engine", "ejs");
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.engine("ejs", ejsMate);

//Route Declaration
const userRoute = require("./routes/user.route");

app.use("/user", userRoute);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
