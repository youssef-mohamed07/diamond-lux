import { Router } from "express";
import {
  getDiamondProducts,
  getDiamondProductById,
} from "./diamond.controller.js";

const diamondRouter = Router();

diamondRouter.get("/diamonds", getDiamondProducts);
diamondRouter.get("/diamonds/:id", getDiamondProductById);

export default diamondRouter;
