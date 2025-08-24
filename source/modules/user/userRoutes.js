import { Router } from "express";
import express from 'express';
import { getAllUsers, registerUser, verifyEmail, loginUser, updateUser, deleteUser, promoteUser, demoteUser } from "./userController.js";
import { checkHeaderToken } from "../../middleware/checkHeaderToken.js";
import { isEmailExist } from "../../middleware/isEmailExist.js";
import { hashPassword } from "../../middleware/hashPassword.js";
import { isCurrentUser } from "../../middleware/isCurrentUser.js";
import { isAdmin } from "../../middleware/isAdmin.js";
import { isEmailConfirmed } from "../../middleware/isEmailConfirmed.js";

export const userRouter = Router();
userRouter.use(express.json());

userRouter.get("/user/getAllUsers", checkHeaderToken, isAdmin, getAllUsers);
userRouter.post("/user/register", isEmailExist, hashPassword, registerUser);
userRouter.post("/user/login", isEmailConfirmed, loginUser);
userRouter.put("/user/update/:id", checkHeaderToken, isCurrentUser, updateUser);
userRouter.get("/user/verifyEmail/:email", verifyEmail);
userRouter.delete("/user/delete/:id", checkHeaderToken, isCurrentUser, deleteUser);
userRouter.patch("/user/promote/:id", checkHeaderToken, isAdmin, promoteUser);
userRouter.patch("/user/demote/:id", checkHeaderToken, isAdmin, demoteUser);
