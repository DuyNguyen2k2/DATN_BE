const OrderServices = require("../services/OrderServices");

const createOrder = async (req, res) => {
  try {
    // console.log("first", req.body);
    const {
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      district,
      commune,
      city,
      phone,
    } = req.body;
    if (
      !paymentMethod ||
      !itemsPrice ||
      !shippingPrice ||
      !totalPrice ||
      !fullName ||
      !address ||
      !district ||
      !commune ||
      !city ||
      !phone
    ) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await OrderServices.createOrder(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getOderDetails = async (req, res) => {
  try {
    const userID = req.params.id;

    if (!userID) {
      return res.status(400).json({
        status: "ERR",
        message: "The userID is required",
      });
    }

    const response = await OrderServices.getOrderDetails(userID);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Internal server error",
    });
  }
};

module.exports = {
  createOrder,
  getOderDetails,
};
