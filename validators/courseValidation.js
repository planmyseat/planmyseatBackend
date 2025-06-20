import { body, param } from "express-validator";

// 🔹 Create Course
export const validateCourse = [
  body("name")
    .trim()
    .escape()
    .notEmpty().withMessage("Course name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Course name must be between 2 and 50 characters"),
];

// 🔹 Update Course
export const validateCourseUpdate = [
  body("name")
    .trim()
    .escape()
    .notEmpty().withMessage("Course name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Course name must be between 2 and 50 characters"),

  param("id")
    .trim()
    .notEmpty().withMessage("Course ID is required")
    .isMongoId().withMessage("Invalid course ID format"),
];

// 🔹 Delete Course
export const validateCourseDelete = [
  param("id")
    .trim()
    .notEmpty().withMessage("Course ID is required")
    .isMongoId().withMessage("Invalid course ID format"),
];

// 🔹 Add Year to Course
export const validateYearAdd = [
  param("courseId")
    .trim()
    .notEmpty().withMessage("Course ID is required")
    .isMongoId().withMessage("Invalid course ID format"),

  body("year")
    .notEmpty().withMessage("Year is required")
    .isInt({ min: 1, max: 10 }).withMessage("Year must be a positive integer")
    .toInt(),

  body("file")
    .custom((_, { req }) => {
      if (!req.file) {
        throw new Error("Excel file is required");
      }

      const allowedMimes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ];

      if (!allowedMimes.includes(req.file.mimetype)) {
        throw new Error("Only Excel (.xlsx or .xls) files are allowed");
      }

      return true;
    }),
];

// 🔹 Delete Year from Course
export const validateDeleteYear = [
  param("courseId")
    .trim()
    .notEmpty().withMessage("Course ID is required")
    .isMongoId().withMessage("Invalid course ID format"),

  param("yearId")
    .trim()
    .notEmpty().withMessage("Year ID is required")
    .isMongoId().withMessage("Invalid year ID format"),
];

// 🔹 Update Year in Course
export const validateUpdateYear = [
  param("courseId")
    .trim()
    .notEmpty().withMessage("Course ID is required")
    .isMongoId().withMessage("Invalid course ID format"),

  param("yearId")
    .trim()
    .notEmpty().withMessage("Year ID is required")
    .isMongoId().withMessage("Invalid year ID format"),

  body("year")
    .notEmpty().withMessage("Year is required")
    .isInt({ min: 1, max: 10 }).withMessage("Year must be a valid number")
    .toInt(),
];
