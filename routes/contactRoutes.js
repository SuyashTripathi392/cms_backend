// routes/contact.routes.js
import express from "express";
import { 
  sendMessage, 
  getMessages, 
  markAsRead, 
  deleteMessage 
} from "../controllers/contactController.js";
import { verifyAuth } from "../middleware/authMiddleware.js";

const contactRoutes = express.Router();

// Public
contactRoutes.post("/", sendMessage);

// Protected
contactRoutes.get("/", verifyAuth, getMessages);
contactRoutes.put("/:id/read", verifyAuth, markAsRead);
contactRoutes.delete("/:id", verifyAuth, deleteMessage);

export default contactRoutes;
