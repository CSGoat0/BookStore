import {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook,
    searchBooks
} from "./bookController.js";
import { Router } from "express";
import express from "express";
import { checkHeaderToken } from "../../middleware/checkHeaderToken.js";
import { isAdmin } from "../../middleware/isAdmin.js";

export const bookRouter = Router();
bookRouter.use(express.json());

bookRouter.post("/book/create", checkHeaderToken, isAdmin, createBook);
bookRouter.get("/book/getAllBooks", getAllBooks);
bookRouter.get("/book/:id", getBookById);
bookRouter.put("/book/update/:id", checkHeaderToken, isAdmin, updateBook);
bookRouter.delete("/book/delete/:id", checkHeaderToken, isAdmin, deleteBook);
bookRouter.post("/book/search", searchBooks);