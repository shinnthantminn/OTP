const fs = require("fs"),
  DB = require("../models/userModel"),
  helper = require("../middleware/helper");

module.exports = {
  migration: async () => {
    const data = await fs.readFileSync("./migration/Admin/Admin.json");
    const admin = JSON.parse(data);
    for (const x of admin) {
      const finder = await DB.findOne({ email: x.email });
      if (!finder) {
        x.password = helper.encode(x.password);
        x.image = await helper.avatar(x.email);
        await new DB(x).save();
      }
    }
  },
};
