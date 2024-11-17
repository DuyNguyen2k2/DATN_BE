    const reviewService = require("../services/ReviewService");
    const responseService = require("../services/ResponseService");

    const getList = async (req, res) => {
        try {
            const query = req.query;
            const reviews = await reviewService.getList(query);
            const data = {
                status: "OK",
                message: 'Reviews fetched successfully',
                data: reviews.data,
                total: reviews.total
            };
            responseService.sendResponse(res, 200, data);
        } catch (error) {
            const data = {
                status: "ERR",
                message: 'Error fetching reviews',
                error: error.message,
            };
            responseService.sendResponse(res, 500, data);
        }
    };

    const create = async (req, res) => {
        try {
            const reviewData = req.body;
            const newReview = await reviewService.create(reviewData);
            const data = {
                status: "OK",
                message: 'Review created successfully',
                data: newReview,
            };
            responseService.sendResponse(res, 201, data);
        } catch (error) {
            const errorData = {
                status: "ERR",
                message: 'Error creating review',
                error: error.message,
            }
            // console.log('error creating review', error)
            responseService.sendResponse(res, 500, errorData);
        }
    };

    const update = async (req, res) => {
        try {
            const reviewId = req.params.id;
            const updateData = req.body;

            const updatedReview = await reviewService.updateReview(reviewId, updateData);
            const data = {
                status: "OK",
                message: 'Review updated successfully',
                data: updatedReview,
            };
            responseService.sendResponse(res, 200, data);
        } catch (error) {
            const errorData = {
                status: "ERR",
                message: 'Error updating review',
                error: error.message,
            }
            console.log('error', error)
            responseService.sendResponse(res, 500, errorData);
        }
    };

    const deleteOne = async (req, res) => {
        const reviewId = req.params.id;

        try {
            const deletedReview = await reviewService.deleteReview(reviewId);
            const data = {
                status: "OK",
                message: 'Review deleted successfully',
                data: deletedReview,
            };
            responseService.sendResponse(res, 200, data);
        } catch (error) {
            const errorData = {
                status: "ERR",
                message: 'Error deleting review',
                error: error.message,
            }
            responseService.sendResponse(res, 500, errorData);
        }
    };

    const getOne = async (req, res) => {
        const { id } = req.params;

        try {
            const review = await reviewService.getOneReview(id);
            const data = {
                status: "OK",
                message: "Review fetched successfully",
                data: review,
            };
            responseService.sendResponse(res, 200, data);
        } catch (error) {
            const errorData = {
                status: "ERR",
                message: 'Error get review',
                error: error.message,
            }
            responseService.sendResponse(res, 500, errorData);
        }
    };

    module.exports = {
        getList,
        create,
        update,
        deleteOne,
        getOne
    };