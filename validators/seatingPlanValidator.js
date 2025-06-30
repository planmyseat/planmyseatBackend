import { body, param } from "express-validator";

export const validateSeatingPlan = [
    body("blockId")
        .trim()
        .notEmpty().withMessage("Block ID is required")
        .isMongoId().withMessage("Invalid Block ID"),

    body("title")
        .trim()
        .escape()
        .notEmpty().withMessage("Title is required")
        .isLength({ max: 100 }).withMessage("Title must not exceed 100 characters"),

    body("date")
        .trim()
        .notEmpty().withMessage("Date is required")
        .isISO8601().withMessage("Date must be a valid ISO8601 date")
        .toDate(),

    body("session")
        .trim()
        .notEmpty().withMessage("Session is required")
        .isIn(["morning", "evening"]).withMessage("Session must be 'morning' or 'evening'"),

    body("courses")
        .isArray({ min: 2 }).withMessage("At least two courses must be selected"),

    body("courses.*.courseId")
        .trim()
        .notEmpty().withMessage("Course ID is required")
        .isMongoId().withMessage("Invalid Course ID"),

    body("courses.*.yearId")
        .trim()
        .notEmpty().withMessage("Year ID is required")
        .isMongoId().withMessage("Invalid Year ID"),

    body("courses.*.subject")
        .trim()
        .escape()
        .notEmpty().withMessage("Subject is required")
        .isLength({ min: 1, max: 100 }).withMessage("Subject must be between 1–100 characters"),
];

export const validateUpdateSeatingPlan = [
    body("blockId")
        .trim()
        .notEmpty().withMessage("Block ID is required")
        .isMongoId().withMessage("Invalid Block ID"),

    param("id")
        .trim()
        .notEmpty().withMessage("Seating Plan Id is required")
        .isMongoId().withMessage("Invalid Seating Plan Id"),

    body("title")
        .trim()
        .escape()
        .notEmpty().withMessage("Title is required")
        .isLength({ max: 100 }).withMessage("Title must not exceed 100 characters"),

    body("date")
        .trim()
        .notEmpty().withMessage("Date is required")
        .isISO8601().withMessage("Date must be a valid ISO8601 date")
        .toDate(),

    body("session")
        .trim()
        .notEmpty().withMessage("Session is required")
        .isIn(["morning", "evening"]).withMessage("Session must be 'morning' or 'evening'"),

    body("courses")
        .isArray({ min: 2 }).withMessage("At least two courses must be selected"),

    body("courses.*.courseId")
        .trim()
        .notEmpty().withMessage("Course ID is required")
        .isMongoId().withMessage("Invalid Course ID"),

    body("courses.*.yearId")
        .trim()
        .notEmpty().withMessage("Year ID is required")
        .isMongoId().withMessage("Invalid Year ID"),

    body("courses.*.subject")
        .trim()
        .escape()
        .notEmpty().withMessage("Subject is required")
        .isLength({ min: 1, max: 100 }).withMessage("Subject must be between 1–100 characters"),
];
