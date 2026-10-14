const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/user-model");
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");

// Import express validator:
const { validationResult } = require("express-validator");
// Initializse nodemailer transporter
const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key:
        process.env.SEND_GRID_API,
    },
  })
);

exports.getLogin = (req, res, next) => {
  let messageError = req.flash("error");
  console.log(messageError.length);

  if (messageError.length > 0) {
    messageError = messageError[0];
  } else {
    messageError = null;
  }
  console.log(`messageError: ${messageError}`);
  // get the cookie status:
  // const isLoggedIn =
  // req.get("Cookie").split(";")[0].trim().split("=")[1] === "true";
  console.log(req.session);
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage: messageError,
  });
};

exports.getSignup = (req, res, next) => {
  let messageError = req.flash("error");
  console.log(messageError.length);

  if (messageError.length > 0) {
    messageError = messageError[0];
  } else {
    messageError = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: messageError,
  });
};

exports.postLogin = (req, res, next) => {
  // ? new: store cookie
  // STORE information
  // res.setHeader("Set-Cookie", "loggedIn=true; HttpOnly");

  // 1) Find the user on db:
  const email = req.body.email;
  const password = req.body.password;
  // Collect errors from request
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        // Handle the user, with flash
        req.flash("error", "Invalid email or password");
        return res.redirect("/login");
      }
      // 2) Validate password:
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            // If is true -> save the session
            // Set the session
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          console.log(`psswrd: ${doMatch}`);
          req.flash("error", "Invalid email or password");
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  // Clear the session
  req.session.destroy(() => {
    res.redirect("/");
  });
};
exports.postSignup = (req, res, next) => {
  console.log("postSignup");

  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  // Collect errors from request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("errors");
    console.log(errors);
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
    });
  }
  // Check if this email exists in db (unique in moongoose ej.)
  User.findOne({ email: email })
    .then((dbEmail) => {
      if (dbEmail) {
        return res.redirect("/signup");
      }
      // HASH the password
      return bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          email: email,
          password: hashedPassword,
          cart: { items: [] },
        });
        return user.save();
      });
    })
    .then((result) => {
      res.redirect("/login");
      // Send the email to the user
      return transporter.sendMail({
        to: email,
        from: "ericlucero501@gmail.com",
        subject: "Sign up succeed!",
        html: "<h1>Your sign-up process is ready!</h1>",
      });
    })
    .catch((err) => console.log(err));
};

exports.getReset = (req, res, next) => {
  let messageError = req.flash("error");
  if (messageError.length > 0) {
    messageError = messageError[0];
  } else {
    messageError = null;
  }
  res.render("auth/reset", {
    pageTitle: "Reset Password",
    path: "/reset",
    errorMessage: messageError,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with this email");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(
        transporter.sendMail({
          to: req.body.email,
          from: "ericlucero501@gmail.com",
          subject: "Password reset",
          html: `
          <p>You requested a password</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>`,
        })
      )
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  // Retrieve this user token
  const token = req.params.tokenNum;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      let messageError = req.flash("error");
      if (messageError.length > 0) {
        messageError = messageError[0];
      } else {
        messageError = null;
      }
      res.render("auth/new-password", {
        pageTitle: "New Password",
        path: "/new-password",
        errorMessage: messageError,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userID = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userID,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPass) => {
      resetUser.password = hashedPass;
      resetUser.resetToken = null;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => console.log(err));
};
