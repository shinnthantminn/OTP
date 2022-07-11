const sharp = require("sharp");

module.exports = {
  image: () => {
    return async (req, res, next) => {
      //image was file name
      if (req.files) {
        const image = req.files.file;
        const name = Date.now() + image.name;
        try {
          await sharp(image.data)
            .resize({
              width: 72,
              height: 72,
            })
            .toFile(`./upload/user/${name}`);
          req.body.image = name;
          next();
        } catch (e) {
          console.log("i am error");
          next(new Error(e));
        }
      } else next();
    };
  },
};
