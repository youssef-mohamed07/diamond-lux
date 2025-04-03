import { Router } from "express";
import { AddToWishlist, clearUserWishlist, getUserWishlist, removeItemFromWishlist, sendWishlistEmail, updateWishlistItem } from "./wishlist.controller.js";

const wishlistRouter = Router();

wishlistRouter.route('/').get(getUserWishlist).post(AddToWishlist);
wishlistRouter.route('/item/:id/remove').delete(removeItemFromWishlist);
wishlistRouter.route('/item/:id/update').put(updateWishlistItem);
wishlistRouter.route('/send-email').post(sendWishlistEmail);
wishlistRouter.route('/clear').delete(clearUserWishlist);

export default wishlistRouter;