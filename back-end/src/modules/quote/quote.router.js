import { Router } from "express";
import { sendQuote } from "./quote.controller.js";

let QuoteRouter = Router()

QuoteRouter.post('/',sendQuote)

export default QuoteRouter