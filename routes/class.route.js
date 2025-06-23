import e from "express";
import { add, Delete, update } from "../controllers/class.controller.js";
import { addClassValidator, deleteClassValidator, updateClassValidator } from "../validators/blockValidation.js";
import { handleValidationErrors } from "../middleware/handleValidation.js";
import { verifyAuth } from "../middleware/verifyAuth.js";

const router = e.Router({mergeParams: true})

router.post("/add", verifyAuth, addClassValidator, handleValidationErrors, add)

router.put("/:name", verifyAuth, updateClassValidator, handleValidationErrors, update)

router.delete("/:name", verifyAuth, deleteClassValidator, handleValidationErrors, Delete)

export default router