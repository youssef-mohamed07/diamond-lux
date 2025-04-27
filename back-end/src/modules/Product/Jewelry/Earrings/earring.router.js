import { Router } from "express";
import { getEarringsProducts } from "./earring.controller.js";

const earringRouter = Router();

earringRouter.get("/jewelery/earrings", getEarringsProducts);

export default earringRouter;
