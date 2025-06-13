import e from "express";
import { add, Delete, fetch, update } from "../controllers/block.controller.js";
import { verifyAuth } from "../middleware/verifyAuth.js";
import { blockValidator } from "../validators/blockValidation.js";
import { handleValidationErrors } from "../middleware/handleValidation.js";
const router = e.Router()

router.get("/",verifyAuth, fetch);

router.post("/add", verifyAuth, blockValidator, handleValidationErrors, add);

router.put("/:id", verifyAuth, blockValidator, handleValidationErrors, update);

router.delete("/:id/delete",verifyAuth, Delete);

export default router