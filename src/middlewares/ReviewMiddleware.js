
const Review = require("../models/ReviewModel");
const responseService = require('../services/ResponseService');

const checkReviewExist = async (req, res, next) => {
    try {
      const { id } = req.params;
      const review = await Review.findById(id).lean();
  
      if (!review) {
          const data = {
              status: "ERR",
              message: "Review not found",
              error: `Review with id ${id} does not exist`,
          };
          return responseService.sendResponse(res, 500, data);
      }
  
      next();
    } catch (error) {
      const data = {
          status: "ERR",
          message: "Error checking review existence",
          error: error.message || error,
      };
      return responseService.sendResponse(res, 500, data);
    }
};

const canEdit = async (req, res, next) => {
    try {
        const { id } = req.params;
        const review = await Review.findById(id).lean();
        const user_id = req.user.id;
        const isAdmin = req.user.isAdmin;
        if(user_id != review.user_id.toString()){
            const data = {
                status: "ERR",
                message: "'Unauthorized'",
                error: `You do not have permission to update or delete this review'`,
            };
            return responseService.sendResponse(res, 500, data);
        }
        next();
      } catch (error) {
        const data = {
            status: "ERR",
            message: "Error checking can edit or delete review",
            error: error.message || error,
        };
        return responseService.sendResponse(res, 500, data);
      }
}

const canDelete = async (req, res, next) => {
    try {
        const { id } = req.params;
        const review = await Review.findById(id).lean();
        const user_id = req.user.id;
        const isAdmin = req.user.isAdmin;
        if(user_id != review.user_id.toString() && !isAdmin){
            const data = {
                status: "ERR",
                message: "'Unauthorized'",
                error: `You do not have permission to delete this review'`,
            };
            return responseService.sendResponse(res, 500, data);
        }
        next();
      } catch (error) {
        const data = {
            status: "ERR",
            message: "Error checking can delete review",
            error: error.message || error,
        };
        return responseService.sendResponse(res, 500, data);
      }
}
module.exports = {
    checkReviewExist,
    canEdit,
    canDelete
};