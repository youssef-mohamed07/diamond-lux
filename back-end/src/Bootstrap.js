import { Wishlist } from "../DB/models/wishlist.schema.js";
import authRouter from "./modules/auth/auth.router.js";
import CategoryRouter from "./modules/category/category.router.js";
import EventRouter from "./modules/events/events.router.js";
import HomeRouter from "./modules/Home/home.router.js";
import ProductRouter from "./modules/Product/product.router.js";
import QuoteRouter from "./modules/quote/quote.router.js";
import TestimonialRouter from "./modules/testimonails/testimonails.router.js";
import UserRouter from "./modules/user/user.router.js";
import wishlistRouter from "./modules/wishlist/wishlist.router.js";
import aboutUsRouter from "./modules/aboutUs/aboutUs.router.js";
import mongoSession from "connect-mongodb-session";
import session from "express-session";
import UIRouter from "./modules/UI/UI.router.js";
import { v4 as uuidv4 } from "uuid";
import FormRouter from "./modules/form/form.router.js";
import {} from 'dotenv/config'

export const bootstrap = (app) => {
  let MongoDBStore = mongoSession(session);
  let store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: "mySessions",
  });

  store.on("error", function (error) {
    console.error("Session store error:", error);
  });

  app.use(
    session({
      secret: process.env.SESSION_SECRET || "your-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 10 * 365 * 24 * 60 * 60 * 1000, // 10 years (a very long duration)
      },
      store,
    })
  );

  app.use((req, res, next) => {
    if (!req.session.userId) {
      req.session.userId = uuidv4();
    } else {
    }
    // Pass the userId in the response headers or as a part of a response body
    res.setHeader("X-User-ID", req.session.userId);
    next();
  });

  app.use("/api/quote", QuoteRouter);
  app.use("/api/testimonials", TestimonialRouter);
  app.use("/api/category", CategoryRouter);
  app.use("/api/product", ProductRouter);
  app.use("/api/event", EventRouter);
  app.use("/api/user", UserRouter);
  app.use("/api/wishlist", wishlistRouter);
  app.use("/api/home", HomeRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/about", aboutUsRouter);
  app.use("/api/ui", UIRouter);
  app.use("/api/form", FormRouter);
};
