const router = require("express").Router();
const passport = require("passport");
const helper = require("../middleware/helper");
const { userDB } = require("../models");

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/fail",
    successRedirect: "http://localhost:3000",
  })
);

router.post("/login/fill", async (req, res, next) => {});

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      con: true,
      msg: req.user,
    });
  }
});

router.get("/fail", (req, res) => {
  res.sendStatus(401);
});

router.get("/logout", (req, res) => {
  res.logout((err) => {
    console.log(err);
  });
  res.redirect("http://127.0.0.1:3000");
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

module.exports = router;
