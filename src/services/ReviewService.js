const Review = require("../models/ReviewModel");

const getList = async (query) => {
  try {
    const { page = 1, limit = 10, product_id, user_id, sort = "oldest" } = query;

    const countQuery = Review.countDocuments();
    const reviewsQuery = Review.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .populate("product_id", "name")
      .populate("user_id", "name avatar");

    if (product_id) {
      countQuery.where("product_id", product_id);
      reviewsQuery.where("product_id", product_id);
    }
    if (user_id) {
      countQuery.where("user_id", user_id);
      reviewsQuery.where("user_id", user_id);
    }

    // Sắp xếp theo createdAt (nếu sort là 'desc' thì sắp xếp theo thứ tự mới nhất đến cũ nhất)
    if (sort === "oldest") {
      reviewsQuery.sort({ createdAt: 1 }); // -1 là giảm dần (mới nhất đến cũ nhất)
    } else {
      reviewsQuery.sort({ createdAt: -1 }); // 1 là tăng dần (cũ nhất đến mới nhất)
    }

    const [total, reviews] = await Promise.all([countQuery, reviewsQuery]);

    return { total, data: reviews };
  } catch (e) {
    throw e;
  }
};

const create = async (reviewData) => {
  try {
    const { product_id, user_id, rating, content, images } = reviewData;
    const newReview = await Review.create({
      product_id,
      user_id,
      rating,
      content,
      images,
    });
    return newReview;
  } catch (error) {
    throw new Error("Error creating review: " + error.message);
  }
};

const updateReview = async (reviewId, updateData) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedReview) {
      throw new Error("Review not found");
    }

    return updatedReview;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteReview = async (reviewId) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(reviewId);

    return deletedReview;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getOneReview = async (reviewId) => {
  try {
    const review = await Review.findById(reviewId).lean();
    return review;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getList,
  create,
  updateReview,
  deleteReview,
  getOneReview,
};
