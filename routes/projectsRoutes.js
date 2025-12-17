// routes/projects.routes.js
import express from "express";
import { 
  getProjects, 
  getProjectById, 
  createProject, 
  updateProject, 
  deleteProject 
} from "../controllers/projectsController.js";
import { verifyAuth } from "../middleware/authmiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";


const projectsRoutes = express.Router();

// Public
projectsRoutes.get("/", getProjects);
projectsRoutes.get("/:id", getProjectById);

// Protected
projectsRoutes.post("/create", verifyAuth,upload.single("image"), createProject);
// projectsRoutes.put("/:id", verifyAuth, updateProject);

// routes/projects.routes.js
projectsRoutes.put("/:id", verifyAuth, upload.single("image"), updateProject);

projectsRoutes.delete("/:id", verifyAuth, deleteProject);

export default projectsRoutes;