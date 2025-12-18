// routes/skills.routes.js
import express from "express";
import { verifyAuth } from "../middleware/authMiddleware.js";
import { createSkill, deleteSkill, getSkills, updateSkill } from "../controllers/skillsController.js";


const skillsRoutes = express.Router();

// Public
skillsRoutes.get("/", getSkills);

// Protected
skillsRoutes.post("/create", verifyAuth, createSkill);
skillsRoutes.put("/:id", verifyAuth, updateSkill);
skillsRoutes.delete("/:id", verifyAuth, deleteSkill);

export default skillsRoutes;
