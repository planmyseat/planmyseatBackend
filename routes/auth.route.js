import e from "express";
import { forgotPassword, login, resetPassword, signup, verifyOTP } from "../controllers/auth.controller.js";
import { validateForgotPassword, validateLogin, validateOTP, validateResetPassword, validateSignup } from "../validators/authValidation.js";
import { handleValidationErrors } from "../middleware/handleValidation.js";
import { rateLimiter } from "../utils/rateLimiter.js";
import { verifyAuth } from "../middleware/verifyAuth.js";

const router = e.Router()

router.post("/login", validateLogin, handleValidationErrors, login)

router.post("/signup",validateSignup, handleValidationErrors, rateLimiter, signup)

router.post("/forgotPassword", validateForgotPassword, handleValidationErrors, rateLimiter, forgotPassword)

router.post("/verifyOTP",validateOTP, handleValidationErrors, rateLimiter, verifyOTP)

router.post("/resetPassword", verifyAuth, validateResetPassword, handleValidationErrors, resetPassword)



export default router