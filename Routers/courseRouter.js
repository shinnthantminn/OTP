const upload = require("../middleware/upload");

const router = require("express").Router(),
  controller = require("../controllers/courseController"),
  {
    validateBody,
    validateUnique,
    validateParam,
  } = require("../middleware/validator"),
  {
    verifyTokenAndAdmin,
    verifyToken,
  } = require("../middleware/verifyMiddleware"),
  { schemaBody, schemaParam } = require("../middleware/joiSchema"),
  DB = require("../models/userModel"),
  videoController = require("../controllers/videoController");

// CREATE
router.post("/", [controller.create]);

// GET ALL
router.get("/", [controller.all]);
// GET and UPDATE and DELETE
router
  .route("/:id")
  .get(controller.get)
  .patch(verifyTokenAndAdmin, controller.patch)
  .delete(verifyTokenAndAdmin, controller.delete);
router.post("/video/create", upload.single("url"), videoController.create);
module.exports = router;
