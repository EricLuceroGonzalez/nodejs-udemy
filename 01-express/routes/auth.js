const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controller");
// Validation middleware
const { check, body } = require("express-validator");

router.get("/login", authController.getLogin);
router.post("/login",
check("email").isEmail().withMessage("Please enter a valid email to login"),
authController.postLogin);
router.post("/logout", authController.postLogout);
router.get("/signup", authController.getSignup);
router.post(
  "/signup",
  check("email").isEmail().withMessage("Please enter a valid email"),
  body("password", 'Please use at least 5 characters with numbers and text').isLength({ min: 5 }).isAlphanumeric(),
  body('confirmPassword').custom((value, {req}) => {
      if (value !== req.body.password) {
          throw new Error("Passwords have to match!")
      }
      return true;
  }),
  authController.postSignup
);
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.get("/reset/:tokenNum", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);
module.exports = router;
