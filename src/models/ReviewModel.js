const mongoose = require("mongoose");
// const ReviewCount = require("./ReviewCountModel");
const Product = require("./ProductModel");

const reviewSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    content: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const updateReviewCounts = async (productId) => {
  const [aggregationResult] = await mongoose.model("Review").aggregate([
    { $match: { product_id: productId } },
    {
      $group: {
        _id: "$product_id",
        totalRating: { $sum: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const totalRating = aggregationResult?.totalRating || 0;
  const totalReviews = aggregationResult?.totalReviews || 0;

  await mongoose
    .model("Product")
    .findOneAndUpdate(
      { _id: productId },
      { rating: Math.round((totalRating/totalReviews) * 10) / 10, review_count: totalReviews },
      { upsert: true, new: true }
    );
};

reviewSchema.post("save", async function (doc) {
  if (doc && doc.product_id) {
    await updateReviewCounts(doc.product_id);
  }
});

reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc && doc.product_id) {
    await updateReviewCounts(doc.product_id);
  }
});

reviewSchema.post("findOneAndUpdate", async function (doc) {
  if (doc && doc.product_id) {
    await updateReviewCounts(doc.product_id);
  }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
