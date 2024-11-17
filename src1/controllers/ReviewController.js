const ReviewServices = require("../services/ReviewServices");

const createReview = async (req, res) => {
  try {
    const { productId } = req.params; // Lấy productId từ URL
    const { rating, comment, image } = req.body; // Nhận các thông tin review

    if (!rating || !comment) {
      return res.status(400).json({
        status: "ERR",
        message: "Rating and comment are required",
      });
    }

    // Tạo mới review thông qua service
    const reviewData = {
      product: productId,
      user: req.user._id, // ID người dùng từ middleware (authUserMiddleware)
      rating,
      comment,
      image: image || null, // Có thể có ảnh nếu người dùng upload
    };

    const response = await ReviewServices.createReview(reviewData);

    return res.status(201).json({
      status: "OK",
      data: response,
    });
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Internal server error",
    });
  }
};

const getAllReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const response = await ReviewServices.getAllReviewsByProduct(productId);

    return res.status(200).json({
      status: "OK",
      data: response,
    });
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Internal server error",
    });
  }
};

const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { rating, comment, image } = req.body;

    const response = await ReviewServices.updateReview(reviewId, {
      rating,
      comment,
      image,
    });

    return res.status(200).json({
      status: "OK",
      data: response,
    });
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Internal server error",
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;

    const response = await ReviewServices.deleteReview(reviewId);

    return res.status(200).json({
      status: "OK",
      data: response,
    });
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Internal server error",
    });
  }
};

module.exports = {
  createReview,
  getAllReviewsByProduct,
  updateReview,
  deleteReview,
};
