const Review = require("../models/ReviewModel");
const Product = require("../models/ProductModel");
const createReview = (newReview) => {
    return new Promise(async (resolve, reject) => {
      const { product, user, rating, comment, image } = newReview;
  
      try {
        // Kiểm tra xem sản phẩm có tồn tại không
        const productData = await Product.findById(product);
        if (!productData) {
          return resolve({
            status: "ERR",
            message: "Sản phẩm không tồn tại",
          });
        }
  
        // Tạo mới đánh giá
        const createdReview = await Review.create({
          product,
          user,
          rating,
          comment,
          image,
        });
  
        // Cập nhật điểm đánh giá trung bình của sản phẩm
        const allReviews = await Review.find({ product });
        const averageRating = allReviews.reduce((acc, review) => acc + review.rating, 0) / allReviews.length;
  
        // Cập nhật rating cho sản phẩm
        await Product.findByIdAndUpdate(product, { rating: averageRating });
  
        // Gửi email thông báo về đánh giá nếu cần
        if (createdReview) {
          
          // Kết quả thành công
          return resolve({
            status: "OK",
            message: "Đánh giá đã được tạo thành công",
            data: createdReview,
          });
        } else {
          return resolve({
            status: "ERR",
            message: "Tạo đánh giá thất bại",
          });
        }
      } catch (e) {
        reject(e);
      }
    });
  };  

const getAllReviewsByProduct = async (productId) => {
  try {
    // Tìm tất cả review của sản phẩm theo productId
    const reviews = await Review.find({ product: productId })
      .populate("user", "name") // Populating thông tin người dùng (optional)
      .exec();

    return reviews;
  } catch (e) {
    throw new Error("Failed to get reviews for this product");
  }
};

const updateReview = async (reviewId, reviewData) => {
  try {
    const review = await Review.findByIdAndUpdate(reviewId, reviewData, { new: true });

    if (!review) {
      throw new Error("Review not found");
    }

    return review;
  } catch (e) {
    throw new Error("Failed to update review");
  }
};

const deleteReview = async (reviewId) => {
  try {
    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      throw new Error("Review not found");
    }

    return { message: "Review deleted successfully" };
  } catch (e) {
    throw new Error("Failed to delete review");
  }
};

module.exports = {
  createReview,
  getAllReviewsByProduct,
  updateReview,
  deleteReview,
};
