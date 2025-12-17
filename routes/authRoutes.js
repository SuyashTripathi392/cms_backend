import express from "express";
import { signup,login, uploadImage, profile, logout } from "../controllers/authController.js";

import { upload } from "../middleware/uploadMiddleware.js";
import { verifyAuth } from "../middleware/authmiddleware.js";

const authRoutes = express.Router();

authRoutes.post("/signup", signup);

authRoutes.post("/login", login);
authRoutes.get("/profile", verifyAuth, profile);
authRoutes.post("/upload-image", verifyAuth,upload.single('image') ,uploadImage);
authRoutes.post("/logout", logout);

export default authRoutes;
