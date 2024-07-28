import express from "express";
import { getReviewsForBook, addReview } from "../controller/review.controller.js";

const router = express.Router();

// Get all reviews for a specific book
router.get("/books/:bookId/reviews", getReviewsForBook);

// Add a review for a specific book
router.post("/books/:bookId/reviews", addReview);

export default router;
