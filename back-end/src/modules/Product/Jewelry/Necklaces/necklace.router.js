import { Router } from "express";
import { getNecklaceProducts } from "./necklace.controller.js";

const necklaceRouter = Router();

necklaceRouter.get("/jewelery/necklaces", getNecklaceProducts);

export default necklaceRouter;
