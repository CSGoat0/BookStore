import { checkHeaderToken } from "../../middleware/checkHeaderToken.js";
import { isCurrentUser } from "../../middleware/isCurrentUser.js";
import { addAddress, updateAddress, removeAddress, getAddresses, setDefaultAddress } from "./addressController.js";
import { Router } from "express";
import express from 'express';

export const addressRouter = Router();
addressRouter.use(express.json());

addressRouter.get("/:id/addresses", checkHeaderToken, isCurrentUser, getAddresses);
addressRouter.post("/:id/addresses", checkHeaderToken, isCurrentUser, addAddress);
addressRouter.put("/:id/addresses", checkHeaderToken, isCurrentUser, updateAddress);
addressRouter.delete("/:id/addresses", checkHeaderToken, isCurrentUser, removeAddress);
addressRouter.patch("/:id/addresses/default", checkHeaderToken, isCurrentUser, setDefaultAddress);
