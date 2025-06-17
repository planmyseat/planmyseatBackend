import { body } from "express-validator";

export const blockValidator = [
  body('block')
    .trim()
    .escape()
    .notEmpty().withMessage('Block Name is required')
    .isLength({ max: 50 }).withMessage('Block Name must be under 50 characters')
];

export const addClassValidator = [
  body("className")
    .trim()
    .escape()
    .notEmpty().withMessage("className is required")
    .isLength({ min: 2 }).withMessage("className must be at least 2 characters"),

  body("row")
    .notEmpty().withMessage("row is required")
    .isInt({ min: 1 }).withMessage("row must be a positive integer"),

  body("columns")
    .notEmpty().withMessage("columns is required")
    .isInt({ min: 1 }).withMessage("columns must be a positive integer"),
];