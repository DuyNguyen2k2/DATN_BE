const express = require("express");
const router = express.Router();
const ReviewController = require("../controllers/ReviewController");
const { authUserMiddleware } = require("../middlewares/authMiddleware"); // Nếu cần xác thực người dùng

// Route tạo review mới, cần có productId
router.post("/create/:productId", authUserMiddleware, ReviewController.createReview);

// Route lấy tất cả review của một sản phẩm
router.get("/getAll/:productId", ReviewController.getAllReviewsByProduct);

// Route cập nhật review
router.put("/update/:id", authUserMiddleware, ReviewController.updateReview);

// Route xóa review
router.delete("/delete/:id", authUserMiddleware, ReviewController.deleteReview);

module.exports = router;
