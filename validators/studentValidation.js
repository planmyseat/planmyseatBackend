import { body, param } from "express-validator";

export const validateAddStudent = [
    // --- Params: courseId & yearId ---
    param('courseId')
        .trim()
        .notEmpty().withMessage('Course ID is required')
        .isMongoId().withMessage('Invalid Course ID')
        .escape(),

    param('yearId')
        .trim()
        .notEmpty().withMessage('Year ID is required')
        .isMongoId().withMessage('Invalid Year ID')
        .escape(),

    // --- Body: uid ---
    body('uid')
        .trim()
        .notEmpty().withMessage('Student UID is required')
        .isString().withMessage('Student UID must be a string')
        .escape(),

    // --- Body: name ---
    body('name')
        .trim()
        .notEmpty().withMessage('Student name is required')
        .isString().withMessage('Student name must be a string')
        .escape(),

    // --- Body: subjects (array) ---
    body('subjects')
        .isArray({ min: 1 }).withMessage('Subjects must be a non-empty array'),

    // --- Body: each subject ---
    body('subjects.*')
        .trim()
        .notEmpty().withMessage('Each subject must be a non-empty string')
        .isString().withMessage('Each subject must be a string')
        .escape(),
];

export const validateUpdateStudent = [
    param('courseId')
        .trim()
        .notEmpty().withMessage('Course ID is required')
        .isMongoId().withMessage('Invalid Course ID')
        .escape(),

    param('yearId')
        .trim()
        .notEmpty().withMessage('Year ID is required')
        .isMongoId().withMessage('Invalid Year ID')
        .escape(),

    param('studentId')
        .trim()
        .notEmpty().withMessage('Year ID is required')
        .isMongoId().withMessage('Invalid Year ID')
        .escape(),

    body('uid')
        .trim()
        .notEmpty().withMessage('Student UID is required')
        .isString().withMessage('Student UID must be a string')
        .escape(),

    body('name')
        .trim()
        .notEmpty().withMessage('Student name is required')
        .isString().withMessage('Student name must be a string')
        .escape(),

    body('subjects')
        .isArray({ min: 1 }).withMessage('Subjects must be a non-empty array'),

    body('subjects.*')
        .trim()
        .notEmpty().withMessage('Each subject must be a non-empty string')
        .isString().withMessage('Each subject must be a string')
        .escape(),
];

export const validateDeleteStudent = [
    param('courseId')
        .trim()
        .notEmpty().withMessage('Course ID is required')
        .isMongoId().withMessage('Invalid Course ID')
        .escape(),

    param('yearId')
        .trim()
        .notEmpty().withMessage('Year ID is required')
        .isMongoId().withMessage('Invalid Year ID')
        .escape(),

    param('studentId')
        .trim()
        .notEmpty().withMessage('Year ID is required')
        .isMongoId().withMessage('Invalid Year ID')
        .escape(),
];