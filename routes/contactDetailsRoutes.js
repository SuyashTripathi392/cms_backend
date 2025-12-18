import express from "express";
import {
  getContactDetails,
  updateContactDetails,
} from "../controllers/contactDetailsController.js";
import { verifyAuth } from "../middleware/authMiddleware.js";

const contactDetailsRoutes = express.Router();

contactDetailsRoutes.get("/", getContactDetails);
contactDetailsRoutes.put("/", verifyAuth, updateContactDetails);

export default contactDetailsRoutes;
