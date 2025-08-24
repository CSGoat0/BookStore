import { Router } from "express";
import express from "express";
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartCount
} from "./cartController.js";
import { checkHeaderToken } from "../../middleware/checkHeaderToken.js";
import { isCurrentUser } from "../../middleware/isCurrentUser.js";

export const cartRouter = Router();
cartRouter.use(express.json());

cartRouter.get("/cart/:id", checkHeaderToken, isCurrentUser, getCart);
cartRouter.post("/cart/:id/add", checkHeaderToken, isCurrentUser, addToCart);
cartRouter.put("/cart/:id/update", checkHeaderToken, isCurrentUser, updateCartItem);
cartRouter.delete("/cart/:id/remove", checkHeaderToken, isCurrentUser, removeFromCart);
cartRouter.delete("/cart/:id/clear", checkHeaderToken, isCurrentUser, clearCart);
cartRouter.get("/cart/:id/count", checkHeaderToken, isCurrentUser, getCartCount);
