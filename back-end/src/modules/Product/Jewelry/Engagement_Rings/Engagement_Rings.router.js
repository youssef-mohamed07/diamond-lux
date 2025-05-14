import { Router } from "express";
import { getEngagement_RingProducts } from "./Engagement_Rings.controller.js";

const engagement_ringRouter = Router();

engagement_ringRouter.get("/jewelery/engagement_rings", getEngagement_RingProducts);

export default engagement_ringRouter;
