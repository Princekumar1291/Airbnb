const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log(process.env.TEMPLATE_ID);


const { check, validationResult } = require('express-validator');
const User = require('../models/User');

// Route Handlers
const getLogin = (req, res) => {
  res.render('auth/login', { title: "Login", isLoggedIn: false });
};

const postLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.render('auth/login', { title: "Login", error: ["User not found"], isLoggedIn: false });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.render('auth/login', { title: "Login", error: ["Invalid password"], isLoggedIn: false });
  }


  req.session.isLoggedIn = true;
  req.session.user = user;
  await req.session.save();
  res.redirect('/homes');
};

const logout = (req, res) => {
  if (req.session) {
    req.session.destroy();
  }
  res.redirect('/auth/login');
};

const getSignup = (req, res) => {
  res.render('auth/signup', { title: "Signup", errors: [], isLoggedIn: false });
};

// Validators
const firstNameValidator = check('firstName')
  .notEmpty()
  .withMessage('First name is required')
  .isAlpha()
  .withMessage('First name can only contain letters')
  .isLength({ min: 2, max: 20 })
  .withMessage('First name must be between 2 and 20 characters long');

const lastNameValidator = check('lastName')
  .notEmpty()
  .withMessage('Last name is required')
  .isAlpha()
  .withMessage('Last name can only contain letters')
  .isLength({ min: 2, max: 20 })
  .withMessage('Last name must be between 2 and 20 characters long');

const emailValidator = check('email')
  .notEmpty()
  .withMessage('Email is required')
  .isEmail()
  .withMessage('Email is invalid');

const passwordValidator = check('password')
  .notEmpty()
  .withMessage('Password is required')
  .isLength({ min: 6, max: 20 })
  .withMessage('Password must be between 6 and 20 characters long')
  .isStrongPassword()
  .withMessage(
    'Password must contain at least one lowercase letter, one uppercase letter, one number, one special character, and be at least 8 characters long'
  );


const confirmPasswordValidator = check('confirmPassword')
  .trim()
  .custom((value, reqObject) => {
    const req = reqObject.req; // Explicitly access req
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  });

const userTypeValidation = check('userType').
  isIn(['guest', 'host'])
  .withMessage('User type must be either guest or host');

const termsValidation = check('terms')
  .notEmpty()
  .withMessage('You must accept the terms and conditions');

const postSignup = [
  firstNameValidator,
  lastNameValidator,
  emailValidator,
  passwordValidator,
  confirmPasswordValidator,
  userTypeValidation,
  termsValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('auth/signup', {
        title: "Signup",
        errorMessages: errors.array().map(error => error.msg),
        isLoggedIn: false,
        oldData: req.body
      });
    }
    next();
  },
  async (req, res) => {
    try {
      const hash = await bcrypt.hash(req.body.password, 10);
      req.body.password = hash
    }
    catch (err) {
      console.error('Error hashing password:', err);
      return res.status(500).send(err);
    }
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      userType: req.body.userType
    })
    try {
      await newUser.save();
      const msg = {
        from: {
          email: process.env.SENDER_EMAIL
        },
        personalizations: [
          {
            "to": [
              {
                email: req.body.email
              }
            ],
            dynamic_template_data: {
              firstName: req.body.firstName,
              yourWebsiteLink: "localhost:3000"
            }
          }
        ],
        template_id: process.env.TEMPLATE_ID
      }

      try {
        await sgMail.send(msg);
        console.log('Email sent successfully');
      } catch (error) {
        console.error('Error sending email:', error);
      }
      res.redirect('/auth/login');
    } catch (error) {
      if (error.code === 11000) {
        req.body.password = "";
        return res.status(400).render('auth/signup', {
          title: "Signup",
          errorMessages: ['User already exists'],
          isLoggedIn: false,
          oldData: req.body
        });
      }
      console.error('Error adding user:', error);
      res.redirect('/auth/signup');
    }
  }
];

const getForgotPassword = (req, res) => {
  res.render('auth/forgot-password', { title: "Forgot Password", errors: [], isLoggedIn: false });
}
const postForgotPassword = async (req, res) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const email = req.body.email;
  req.session.email = email;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).render('auth/forgot-password', { title: "Forgot Password", errors: ['User does not exist'], isLoggedIn: false });
  }
  user.otp = {
    code: otp,
    expiry: new Date(Date.now() + 600000) // 10 minutes
  };
  await user.save();
  const msg = {
    from: {
      email: process.env.SENDER_EMAIL
    },
    personalizations: [
      {
        "to": [
          {
            email: email
          }
        ],
        dynamic_template_data: {
          firstName: user.firstName,
          otp: otp
        }
      }
    ],
    template_id: process.env.TEMPLATE_ID_FORGOT_PASSWORD
  }
  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
  res.redirect('/auth/verify-otp');
}

const getVerifyOtp = (req, res) => {
  res.render('auth/verify-otp', { title: "Verify OTP", errors: [], isLoggedIn: false });
}
const postVerifyOtp = async (req, res) => {
  const otp = req.body.otp;
  const user = await User.findOne({ email: req.session.email });
  if (!user) {
    return res.status(400).render('auth/verify-otp', { title: "Verify OTP", errors: ['User does not exist'], isLoggedIn: false });
  }
  const currentOtp = user.otp.code;
  const isOtpValid = otp == currentOtp;
  const isOtpExpired = user.otp.expiry < new Date();
  if (!isOtpValid || isOtpExpired) {
    return res.status(400).render('auth/verify-otp', { title: "Verify OTP", errors: ['Invalid OTP'], isLoggedIn: false });
  }
  res.redirect('/auth/reset-password');
}

const getResetPassword = (req, res) => {
  res.render('auth/reset-password', { title: "Reset Password", errors: [], isLoggedIn: false });
}
const postResetPassword = [
  passwordValidator,
  confirmPasswordValidator,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('auth/reset-password', {
        title: "Reset Password",
        errorMessages: errors.array().map(error => error.msg),
        isLoggedIn: false
      });
    }
    next();
  },
  async (req, res) => {
    const password = req.body.password;
    try {
      let hash = await bcrypt.hash(password, 10);
      await User.findOneAndUpdate({ email: req.session.email }, { password: hash });
    } catch (error) {
      console.error('Error updating password:', error);
    }
    res.redirect('/auth/login');
  }
]


module.exports = { getLogin, postLogin, logout, getSignup, postSignup, getForgotPassword, postForgotPassword, getVerifyOtp, postVerifyOtp, getResetPassword, postResetPassword };