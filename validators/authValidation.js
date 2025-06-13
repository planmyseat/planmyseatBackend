import { body } from 'express-validator';

export const validateSignup = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters')
    .escape(),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .escape(),
];

export const validateOTP = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  body('otp')
    .trim()
    .notEmpty().withMessage('OTP is required')
    .isLength({ min: 4, max: 4 }).withMessage('OTP must be 4 characters') // Some OTPs can be 6 digits
    .isNumeric().withMessage('OTP must be numeric')
    .escape()
];


export const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6, max: 100 }).withMessage('Password must be between 6 and 100 characters')
    .escape()
];


export const validateForgotPassword = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail()
];

export const validateResetPassword = [
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6, max: 100 }).withMessage('Password must be between 6 and 100 characters')
    .escape()
];
