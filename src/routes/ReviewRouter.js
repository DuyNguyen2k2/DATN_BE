const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/ReviewController");
const productMiddleware = require("../middlewares/ProductMiddleware");
const userMiddleware = require("../middlewares/UserMiddleware");
const reviewMiddleware = require("../middlewares/ReviewMiddleware");

const {
    authMiddleware,
    authUserMiddleware,
} = require("../middlewares/authMiddleware");

router.get(
    "/getAll",
    reviewController.getList
);
router.post(
    "/createReview",
    productMiddleware.checkProductExist,
    userMiddleware.checkUserExist,
    reviewController.create
);

router.put(
    '/updateReview/:id',
    authUserMiddleware,
    reviewMiddleware.checkReviewExist,
    reviewMiddleware.canEdit,
    reviewController.update
);

router.delete(
    '/deleteReview/:id',
    authUserMiddleware,
    reviewMiddleware.checkReviewExist,
    reviewMiddleware.canDelete,
    reviewController.deleteOne
);

router.get(
    "getOneReview/:id",
    reviewMiddleware.checkReviewExist,
    reviewController.getOne
);
module.exports = router;
