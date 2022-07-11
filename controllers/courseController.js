const helper = require("../middleware/helper"),
  DB = require("../models/courseModel");

module.exports = {
  all: async (req, res) => {
    try {
      const course = await DB.find();
      helper.fMsg(res, "all course from server", course);
    } catch (err) {
      helper.fMsg(res, "no courses found", err);
    }
  },
  get: async (req, res) => {
    try {
      const course = await DB.findById(req.params.id);
      helper.fMsg(res, "Course Here.", course);
    } catch (err) {
      helper.fMsg(res, "no course found", err);
    }
  },
  create: async (req, res) => {
    const course = new DB(req.body);
    try {
      const saved = await course.save();
      helper.fMsg(res, "Create Success", saved);
    } catch (err) {
      helper.fMsg(res, "Creating Fail", err);
    }
  },
  patch: async (req, res) => {
    const id = req.params.id;
    try {
      const course = await DB.findByIdAndUpdate(
        id,
        {
          $set: req.body,
        },
        { new: true }
      );
      helper.fMsg(res, "Update Success", course);
    } catch (err) {
      helper.fMsg(res, "Updatig Failed.", err);
    }
  },
  delete: async (req, res) => {
    try {
      const course = await DB.findByIdAndDelete(req.params.id);
      helper.fMsg(res, "Delete Success.", { Msg: "Delete Success", course });
    } catch (err) {
      helper.fMsg(res, "Deleteing Fail", err);
    }
  },
};
