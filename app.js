if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
app.use(methodOverride("_method")); // Handles PUT and DELETE requests
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./router/listing.js");
const reviewsRouter = require("./router/reviews.js");
const userRouter = require("./router/user.js");
const countriesApiRoutes = require("./routes/api/countries");
const passport = require("passport");
const localStragery = require("passport-local");
const User = require("./models/user.js");



// MongoDB connection
const DBurl = process.env.ATLASDB_URL;

console.log("MongoDB connection string:", DBurl); // Log connection string for debugging

async function main() {
  try {
    await mongoose.connect(DBurl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
  }
}

main();

// Middleware setup
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); // Parses form data
app.use(express.json());
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const session = require("express-session");
const MongoStore = require("connect-mongo");
const { error } = require("console");

const store = MongoStore.create({
  mongoUrl: DBurl,
  crypto: {
    secret: process.env.SECRET, 
  },
  touchAfter: 24 * 60 * 60, // time period in seconds
});

const sessionOptions = {
  store: store,
  secret: process.env.SECRET, // Secret for signing the session ID cookie
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    // Change to true in production environment!
  },
};

store.on("error", () => {
  console.log(" Mongo Session store error!", error);
});

app.use(session(sessionOptions));

app.use(flash());

// Passport configuration

app.use(passport.initialize());
app.use(passport.session());

const LocalStrategy = require("passport-local").Strategy;
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());



// flash middleware

app.use((req, res, next) => {
  res.locals.success = req.flash("success");

  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;

  next();
});

// Route setup
app.use(listingRouter);
app.use(reviewsRouter);
app.use(userRouter);
app.use("/api/countries", countriesApiRoutes);

// 404 Error handling
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).render("./listings/error.ejs", {
    statusCode,
    message,
    originalUrl: req.originalUrl,
  });
});

// Start server
app.listen(8080, () => {
  console.log("App listening on port 8080!");
});
