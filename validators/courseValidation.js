import { body, param } from "express-validator";

export const validateCourse = [
  body("name")
    .trim()
    .escape()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2 }).withMessage("Course name must be at least 2 characters"),
]

export const validateCourseUpdate = [
  body("name")
    .trim()
    .escape()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2 }).withMessage("Course name must be at least 2 characters"),
  param('id')
    .trim()
    .notEmpty().withMessage('Course ID is required')
    .isMongoId().withMessage('Invalid course ID format'),
];

export const validateCourseDelete = [
  param('id')
    .trim()
    .notEmpty().withMessage('Course ID is required')
    .isMongoId().withMessage('Invalid course ID format'),
]

export const validateYearAdd = [
  param('courseId')
    .notEmpty().withMessage('Course ID is required')
    .isMongoId().withMessage('Invalid course ID format'),

  body('year')
    .trim()
    .notEmpty().withMessage('Year is required')
    .toInt()
    .isInt({ min: 1 }).withMessage('Year must be a valid number'),

  body('file')
    .custom((_, { req }) => {
      if (!req.file) {
        throw new Error('Excel file is required');
      }

      const allowedMimes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ];

      if (!allowedMimes.includes(req.file.mimetype)) {
        throw new Error('Only Excel files are allowed');
      }

      return true;
    }),
];



export const validateDeleteYear = [
  param('courseId')
    .trim()
    .notEmpty().withMessage('Course ID is required')
    .isMongoId().withMessage('Invalid Course ID'),

  param('yearId')
    .trim()
    .notEmpty().withMessage('Year ID is required')
    .isMongoId().withMessage('Invalid Year ID'),
];


export const validateUpdateYear = [
  param('courseId')
    .trim()
    .notEmpty().withMessage('Course ID is required')
    .isMongoId().withMessage('Invalid Course ID'),

  param('yearId')
    .trim()
    .notEmpty().withMessage('Year ID is required')
    .isMongoId().withMessage('Invalid Year ID'),
  body('year')
    .trim()
    .notEmpty().withMessage('Year is required')
    .isInt({ min: 1 }).withMessage('Year must be a valid number')
    .toInt(),
];