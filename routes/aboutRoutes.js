// routes/about.routes.js
import express from "express";
import {
  getAbout,
  updateAbout,
  uploadImage,
} from "../controllers/aboutController.js";
import { verifyAuth } from "../middleware/authmiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const aboutRoutes = express.Router();

// Public
aboutRoutes.get("/", getAbout);

// Admin only
aboutRoutes.put("/update", verifyAuth, updateAbout);

aboutRoutes.post(
  "/upload-image",
  verifyAuth,
  upload.single("image"),
  uploadImage
);

export default aboutRoutes;
