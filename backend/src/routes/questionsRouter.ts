import express from "express";
import * as authController from "../controllers/authController";
import * as questionsController from "../controllers/questionsController";

const router = express.Router();

router.get("/", questionsController.getAllQuestions);
router.post("/", authController.protect, questionsController.createQuestion);
router.get("/:id", questionsController.getQuestion);
router.patch("/:id", questionsController.updateQuestion);
router.delete("/:id", questionsController.deleteQuestion);

export default router;
