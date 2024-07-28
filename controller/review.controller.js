import Review from '../model/review.model.js'; // Ensure the path is correct
import Book from '../model/book.model.js'; // For updating the book's average rating

// Get all reviews for a specific book
export const getReviewsForBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const reviews = await Review.find({ bookId }).populate('userId', 'name'); // Populate user info if needed
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews', error });
  }
};

// Add a review for a specific book
export const addReview = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { userId, rating, review } = req.body;

    // Create a new review
    const newReview = new Review({
      bookId,
      userId,
      rating,
      review
    });
    await newReview.save();

    // Update the average rating for the book
    const reviews = await Review.find({ bookId });
    const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await Book.findByIdAndUpdate(bookId, { averageRating });

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add review', error });
  }
};
