import { body, param } from "express-validator";

// Block Validators
export const blockValidator = [
  body('block')
    .trim()
    .escape()
    .notEmpty().withMessage('Block Name is required')
    .isLength({ max: 50 }).withMessage('Block Name must be under 50 characters')
];

export const blockUpdateValidator = [
  body('block')
    .trim()
    .escape()
    .notEmpty().withMessage('Block Name is required')
    .isLength({ max: 50 }).withMessage('Block Name must be under 50 characters'),

  param('id')
    .trim()
    .notEmpty().withMessage('Block ID is required')
    .isMongoId().withMessage('Invalid block ID format'),
];

export const blockDeleteValidator = [
  param('id')
    .trim()
    .notEmpty().withMessage('Block ID is required')
    .isMongoId().withMessage('Invalid block ID format'),
];

// Class Validators
export const addClassValidator = [
  body("className")
    .trim()
    .escape()
    .notEmpty().withMessage("Class name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Class name must be 2-50 characters long"),

  body("row")
    .notEmpty().withMessage("Row is required")
    .isInt({ min: 1 }).withMessage("Row must be a positive integer"),

  body("columns")
    .notEmpty().withMessage("Columns is required")
    .isInt({ min: 1 }).withMessage("Columns must be a positive integer"),
];

export const updateClassValidator = [
  body("className")
    .trim()
    .escape()
    .notEmpty().withMessage("Class name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Class name must be 2-50 characters long"),

  body("row")
    .notEmpty().withMessage("Row is required")
    .isInt({ min: 1 }).withMessage("Row must be a positive integer"),

  body("columns")
    .notEmpty().withMessage("Columns is required")
    .isInt({ min: 1 }).withMessage("Columns must be a positive integer"),

  param('id')
    .trim()
    .notEmpty().withMessage('Block ID is required')
    .isMongoId().withMessage('Invalid block ID format'),

  param('name')
    .trim()
    .escape()
    .notEmpty().withMessage('Class name parameter is required')
    .isLength({ min: 2, max: 50 }).withMessage('Class name must be 2-50 characters long'),
];

export const deleteClassValidator = [
  param('id')
    .trim()
    .notEmpty().withMessage('Block ID is required')
    .isMongoId().withMessage('Invalid block ID format'),

  param('name')
    .trim()
    .escape()
    .notEmpty().withMessage('Class name parameter is required')
    .isLength({ min: 2, max: 50 }).withMessage('Class name must be 2-50 characters long'),
];
