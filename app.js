require("dotenv").config();
const Oauth = require("./middleware/Oauth");
const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  fileUpload = require("express-fileupload"),
  path = require("path"),
  session = require("express-session"),
  passport = require("passport"),
  cors = require("cors");

const PORT = process.env.PORT || 5000;

//setup ejs
app.set("view engine", "ejs");

app.use("/upload", express.static(path.join(__dirname, "/upload")));

app.use(
  session({
    secret: process.env.KEY,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: "GET,POST,PATCH,DELETE,PUT",
    credentials: true,
  })
);
app.use(express.json());
// app.use(fileUpload());

// mongoDB connection
mongoose.connect(process.env.DB, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

// Router
const { userRouter, courseRouter, authRoute } = require("./Routers");

app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/auth", authRoute);

//migration
const migrator = require("./migration/migrator");

(async () => {
  await migrator.migration();
})();

//fallback route
app.get("*", (req, res) => {
  res.status(200).json({
    msg: "get nothing in that here",
  });
});

// error handler
app.use((err, req, res, next) => {
  err.status = err.status || 200;
  res.status(err.status).json({
    con: false,
    msg: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running from http://127.0.0.1:${PORT}`);
});
