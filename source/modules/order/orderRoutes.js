import {
    createOrder,
    getUserOrders,
    getOrder,
    getAllOrders,
    updateOrderStatus,
    cancelOrder
} from "./orderController.js";
import { Router } from "express";
import express from "express";
import { checkHeaderToken } from "../../middleware/checkHeaderToken.js";
import { isCurrentUser } from "../../middleware/isCurrentUser.js";
import { isAdmin } from "../../middleware/isAdmin.js";

export const orderRouter = Router();
orderRouter.use(express.json());

orderRouter.post("/order/create/:id", checkHeaderToken, isCurrentUser, createOrder);
orderRouter.get("/order/getUserOrders/:id", checkHeaderToken, isCurrentUser, getUserOrders);
orderRouter.get("/order/:id", checkHeaderToken, isCurrentUser, getOrder);
orderRouter.get("/order/getAllOrders/:id", checkHeaderToken, isAdmin, getAllOrders);
orderRouter.put("/order/updateStatus/:id", checkHeaderToken, isAdmin, updateOrderStatus);
orderRouter.delete("/order/:id", checkHeaderToken, isCurrentUser, cancelOrder);
