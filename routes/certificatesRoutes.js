// routes/certificates.routes.js
import express from "express";
import { 
  getCertificates, 
  getCertificateById, 
  createCertificate, 
  updateCertificate, 
  deleteCertificate 
} from "../controllers/certificatesController.js";
import { verifyAuth } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";


const certificatesRoutes = express.Router();

// Public routes
certificatesRoutes.get("/", getCertificates);
certificatesRoutes.get("/:id", getCertificateById);

// Protected routes
certificatesRoutes.post("/", verifyAuth,upload.single('image'), createCertificate);
certificatesRoutes.put(
  "/:id",
  verifyAuth,
  upload.single("image"), // 👈 MUST
  updateCertificate
);

certificatesRoutes.delete("/:id", verifyAuth, deleteCertificate);

export default certificatesRoutes;
