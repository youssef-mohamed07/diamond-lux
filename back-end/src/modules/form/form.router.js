import express from "express";
import {
  getForm,
  addField,
  editField,
  removeField,
  reorderFields,
  getUnavailableDates,
  addUnavailableDate,
  removeUnavailableDate
} from "./form.controller.js";

const router = express.Router();

router.get("/", getForm); // Get form structure
router.post("/add-field", addField); // Add new field
router.put("/edit-field/:id", editField); // Edit field
router.delete("/remove-field/:id", removeField); // Now removing by ID
router.put("/reorder-fields", reorderFields); // Reorder fields

// Add new routes for unavailable dates
router.get("/unavailable-dates", getUnavailableDates);
router.post("/unavailable-dates", addUnavailableDate);
router.delete("/unavailable-dates/:date", removeUnavailableDate);

export default router;
