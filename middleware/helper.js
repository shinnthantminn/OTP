const bcrypt = require("bcryptjs"),
  jwt = require("jsonwebtoken"),
  gravatar = require("gravatar");

module.exports = {
  //format message
  fMsg: (res, msg = "", result = []) => {
    res.status(200).json({
      con: true,
      msg,
      result,
    });
  },

  //password encrypt
  encode: (payload) => bcrypt.hashSync(payload, 10),

  //password compare
  compare: (plane, hash) => bcrypt.compareSync(plane, hash),

  //token generate
  token: (payload) =>
    jwt.sign(payload, process.env.KEY, {
      expiresIn: "7d",
    }),

  // token verify
  verify: (payload) =>
    jwt.verify(payload, process.env.KEY, (err, info) => {
      try {
        return info;
      } catch (e) {
        throw new Error(err);
      }
    }),

  //avatar creator
  avatar: (payload) => gravatar.url(payload, { s: "100", d: "mm" }),
};
