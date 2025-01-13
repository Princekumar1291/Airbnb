const { check, validationResult } = require('express-validator');
const User = require('../models/User');

// Route Handlers
const getLogin = (req, res) => {
  res.render('auth/login', { title: "Login", isLoggedIn: false });
};

const postLogin = (req, res) => {
  if (req.session) {
    req.session.isLoggedIn = true;
  }
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
  (req, res) => {
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      userType: req.body.userType
    })
    newUser.save().then(() => {
      res.redirect('/auth/login');
    }).catch(err => {
      if (err.code === 11000) {
        return res.status(400).render('auth/signup', { 
          title: "Signup", 
          errorMessages: ['User already exists'], 
          isLoggedIn: false, 
          oldData: req.body
        });
      }
      console.error('Error adding user:', err);
      res.redirect('/auth/signup');
    })
  }
];

module.exports = { getLogin, postLogin, logout, getSignup, postSignup };