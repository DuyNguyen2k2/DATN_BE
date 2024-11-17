const Product = require('../models/ProductModel');
const responseService = require('../services/ResponseService');

const checkProductExist = async (req, res, next) => {
    try {
        const { product_id } = req.body;
        const product = await Product.findById(product_id).lean();

        if (!product) {
            const data = {
                status: "ERR",
                message: "Product not found",
                error: `Product with id ${product_id} does not exist`,
            };
            return responseService.sendResponse(res, 500, data);
        }

        next();
    } catch (error) {
        const data = {
            status: "ERR",
            message: "Error checking product existence",
            error: error.message || error,
        };
        return responseService.sendResponse(res, 500, data);
    }
};

module.exports = {
    checkProductExist
};
