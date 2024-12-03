const User = require('../models/UserModel');
const responseService = require('../services/ResponseService');

const checkUserExist = async (req, res, next) => {
    try {
        const { user_id } = req.body;
        const user = await User.findById(user_id).lean();

        if (!user) {
            const data = {
                status: "ERR",
                message: "User not found",
                error: `User with id ${user_id} does not exist`,
            };
            return responseService.sendResponse(res, 500, data);
        }

        next();
    } catch (error) {
        const data = {
            status: "ERR",
            message: "Vui lòng đăng nhập để tiếp tục",
            error: error.message || error,
        };
        return responseService.sendResponse(res, 500, data);
    }
};

module.exports = {
    checkUserExist
};
