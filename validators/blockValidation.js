import { body } from "express-validator";

export const blockValidator = [
  body('block')
    .trim()
    .escape()
    .notEmpty().withMessage('Block Name is required')
    .isLength({ max: 50 }).withMessage('Block Name must be under 50 characters')
];
