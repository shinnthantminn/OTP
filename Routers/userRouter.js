const router = require("express").Router(),
  controller = require("../controllers/userController"),
  {
    validateBody,
    validateUnique,
    validateParam,
  } = require("../middleware/validator"),
  { schemaBody, schemaParam } = require("../middleware/joiSchema"),
  { image } = require("../middleware/ImageTransfer"),
  DB = require("../models/userModel");

// get user with pagination
router.get("/paginate/:page", controller.all);

// user register
router.post("/register", [
  validateBody(schemaBody.user.register.body),
  validateUnique(DB, "username", "email"),
  controller.register,
]);

//check Auth
router.post("/remember", controller.remember);

// login
router.post("/", [validateBody(schemaBody.user.login), controller.login]);

// verify with otp
router.post("/verify", [
  validateBody(schemaBody.user.verify),
  controller.verify,
]);

//Resend otp Code
router.post("/resend", [
  validateBody(schemaBody.user.resend),
  controller.resendOTP,
]);

//patch user data
router
  .route("/:id")
  .get(validateParam(schemaParam.id, "id"), controller.get)
  .patch(
    validateParam(schemaParam.id, "id"),
    validateBody(schemaBody.user.register.patch),
    validateUnique(DB, "username", "email"),
    image(),
    controller.patch
  );

//reset Password
router.post("/reset", validateBody(schemaBody.user.resend), controller.reset);

module.exports = router;
