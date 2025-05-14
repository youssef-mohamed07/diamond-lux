import { Router } from "express";
import { getWedding_BandProducts } from "./Wedding_Bands.controller.js";

const wedding_bandRouter = Router();

wedding_bandRouter.get("/jewelery/wedding_bands", getWedding_BandProducts);

export default wedding_bandRouter;
