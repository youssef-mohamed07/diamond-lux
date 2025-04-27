import { Router } from "express";
import { getBraceletsProducts } from "./bracelet.controller.js";

const braceletRouter = Router();

braceletRouter.get("/jewelery/bracelets", getBraceletsProducts);

export default braceletRouter;
