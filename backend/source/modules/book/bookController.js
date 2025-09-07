import { bookModel } from "../../../database/models/bookModel.js";

const createBook = async (req, res) => {
    try {
        const book = new bookModel(req.body);
        const savedBook = await book.save();
        res.status(201).json({
            success: true,
            message: 'Book created successfully',
            book: savedBook
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'Book with this ISBN or SKU already exists'
            });
        }
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

const getAllBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build filter object
        const filters = {};
        if (req.query.genre) filters.genre = req.query.genre;
        if (req.query.isActive !== undefined) {
            filters.isActive = req.query.isActive === 'true';
        }

        const books = await bookModel.find(filters)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await bookModel.countDocuments(filters);

        res.json({
            success: true,
            count: books.length,
            total,
            pagination: {
                page,
                limit,
                pages: Math.ceil(total / limit)
            },
            books
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const getBookById = async (req, res) => {
    try {
        const book = await bookModel.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        res.json({
            success: true,
            book
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const updateBook = async (req, res) => {
    try {
        // Prevent updating ISBN and SKU
        const { isbn, sku, ...updateData } = req.body;

        const book = await bookModel.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true, // Return updated document
                runValidators: true // Run schema validators
            }
        );

        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        res.json({
            success: true,
            message: 'Book updated successfully',
            book
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

const deleteBook = async (req, res) => {
    try {
        // Soft delete (recommended)
        const book = await bookModel.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        res.json({
            success: true,
            message: 'Book deactivated successfully'
        });

        // For permanent delete (use with caution):
        // const book = await bookModel.findByIdAndDelete(req.params.id);
        // res.json({ success: true, message: 'Book deleted permanently' });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const searchBooks = async (req, res) => {
    try {
        const { q: searchTerm, page = 1, limit = 10 } = req.query;

        if (!searchTerm) {
            return res.status(400).json({
                success: false,
                error: 'Search term is required'
            });
        }

        const skip = (page - 1) * limit;

        const books = await bookModel.find(
            { $text: { $search: searchTerm } },
            { score: { $meta: "textScore" } }
        )
            .sort({ score: { $meta: "textScore" } })
            .skip(skip)
            .limit(limit);

        const total = await bookModel.countDocuments({
            $text: { $search: searchTerm }
        });

        res.json({
            success: true,
            count: books.length,
            total,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            },
            books
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
export {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook,
    searchBooks,
};