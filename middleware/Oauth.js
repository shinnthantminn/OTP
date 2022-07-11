const { verify } = require("crypto");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "555614043629-pn2f501dov95pa19jmkphebbfhrepaf8.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:4000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
