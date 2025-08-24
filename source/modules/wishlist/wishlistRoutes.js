import { addToWishlist, removeFromWishlist, getWishlist, clearWishlist } from "./wishlistController.js";
import { Router } from "express";
import express from "express";

export const wishlistRouter = Router();
wishlistRouter.use(express.json());

wishlistRouter.get("/:id/wishlist", getWishlist);
wishlistRouter.post("/:id/wishlist", addToWishlist);
wishlistRouter.delete("/:id/wishlist", removeFromWishlist);
wishlistRouter.delete("/:id/wishlist/clear", clearWishlist);