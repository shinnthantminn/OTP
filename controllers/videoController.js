const helper = require("../middleware/helper"),
  DB = require("../models/videoModel");

module.exports = {
  all: async (req, res) => {
    try {
      const video = await DB.find();
      helper.fMsg(res, "all course from server", video);
    } catch (err) {
      helper.fMsg(res, "no videos found", err);
    }
  },
  get: async (req, res) => {
    try {
      const video = await DB.findById(req.params.id);
      helper.fMsg(res, "Video Here.", video);
    } catch (err) {
      helper.fMsg(res, "no video found", err);
    }
  },
  create: (req, res) => {
    const title = req.body.title;
    const desc = req.body.desc;
    const url = req.file.filename;
    const newVideoData = {
      title,
      desc,
      url,
    };
    const newVideo = new DB(newVideoData);
    newVideo
      .save()
      .then(() => res.json("video Added"))
      .catch((err) => res.status(400).json(err));
  },
};
