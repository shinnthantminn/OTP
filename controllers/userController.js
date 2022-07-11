const DB = require("../models/userModel"),
  helper = require("../middleware/helper"),
  otpSender = require("../middleware/otpSender"),
  otpDB = require("../models/otpModel"),
  fs = require("fs");
const { userDB } = require("../models");
const { sendEmail } = require("../middleware/otpSender");

module.exports = {
  all: async (req, res) => {
    // pagination
    if (req.params.page > 0) {
      const page = +req.params.page,
        limit = +process.env.limit,
        reqPage = page === 1 ? 0 : page - 1,
        skipCount = reqPage * limit,
        user = await DB.find().skip(skipCount).limit(limit);
      helper.fMsg(res, "all user from server", user);
    } else helper.fMsg(res, "no user found");
  },
  register: async (req, res, next) => {
    req.body.password = await helper.encode(req.body.password);
    req.body.image = await helper.avatar(req.body.email);
    const user = await new DB(req.body).save();
    await otpSender.sendEmail(user);

    helper.fMsg(res, "register complete", user);
  },
  login: async (req, res, next) => {
    const user = await DB.findOne({ email: req.body.email });
    if (user) {
      if (helper.compare(req.body.password, user.password)) {
        if (user.verify) {
          const item = user.toObject();
          delete item.password;
          item.token = helper.token({ id: item._id });
          // i want to use redis P-P
          helper.fMsg(res, "login complete", item);
        } else {
          res.json({
            con: false,
            statusCode: 401,
          });
        }
      } else next(new Error("Email Or Password Credential Error"));
    } else next(new Error("Email Or Password Credential Error"));
  },
  verify: async (req, res, next) => {
    console.log(req.body);
    const finder = await otpDB.findOne({ otp: req.body.otp });
    if (finder) {
      if (finder.expire > Date.now()) {
        await DB.findByIdAndUpdate(finder.userId, { verify: true });
        const user = await DB.findById(finder.userId);
        await otpDB.findByIdAndDelete(finder._id);
        helper.fMsg(res, "account verify complete", user);
      } else {
        await otpDB.findByIdAndDelete(finder._id);
        next(new Error("otp code was expire"));
      }
    } else next(new Error("otp code was wrong"));
  },
  resendOTP: async (req, res, next) => {
    const finder = await DB.findOne({ email: req.body.email });
    if (finder) {
      const oldOtp = await otpDB.findOne({ email: finder.email });
      if (oldOtp) {
        await otpDB.findByIdAndDelete(oldOtp._id);
      }
      await otpSender.sendEmail(finder);
      helper.fMsg(res, "opt was send again");
    } else next(new Error("no user found"));
  },
  patch: async (req, res, next) => {
    const finder = await DB.findById(req.params.id);
    if (req.body.password) {
      req.body.password = helper.encode(req.body.password);
    }
    if (finder) {
      if (req.body.image) {
        if (
          !(finder.image.startsWith("//") || finder.image.startsWith("http"))
        ) {
          try {
            fs.unlinkSync(`./upload/user/${finder.image}`);
          } catch (e) {}
        }
      }
      await DB.findByIdAndUpdate(finder._id, req.body);
      const user = await DB.findById(finder._id);
      helper.fMsg(res, "user update complete", user);
    } else next(new Error("no user with that id"));
  },
  get: async (req, res, next) => {
    const finder = await DB.findById(req.params.id);
    finder
      ? helper.fMsg(res, "user get by id", finder)
      : next(new Error("noo user with that id"));
  },
  remember: async (req, res, next) => {
    const token = req.body.token;
    const user = helper.verify(token);
    if (user) {
      const finder = await userDB.findById(user.id);
      if (finder) {
        helper.fMsg(res, "auth complete", finder);
      } else next(new Error("this account was delete"));
    } else {
      next(new Error("expire auth"));
    }
  },
  reset: async (req, res, next) => {
    const finder = await userDB.findOne(req.body);
    if (finder) {
      await sendEmail(finder);
      helper.fMsg(res, "send Verify Message", finder);
    } else next(new Error("No User found"));
  },
};
