const OrderServices = require("../services/OrderServices");

const createOrder = async (req, res) => {
  try {
    const {
      paymentMethod,
      itemsPrice,
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

const getAllOrderDetails = async (req, res) => {
  try {
    const userID = req.params.id;

    if (!userID) {
      return res.status(400).json({
        status: "ERR",
        message: "The userID is required",
      });
    }

    const response = await OrderServices.getAllOrderDetails(userID);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Internal server error",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const orderID = req.params.id;

    if (!orderID) {
      return res.status(400).json({
        status: "ERR",
        message: "The orderID is required",
      });
    }

    const response = await OrderServices.getOrderDetails(orderID);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Internal server error",
    });
  }
};

const cancelOrders = async (req, res) => {
  try {
    const orderID = req.params.id;
    const data = req.body
    console.log('check', orderID, req.body[0].amount)
    if (!orderID) {
      return res.status(400).json({
        status: "ERR",
        message: "The orderID is required",
      });
    }

    const response = await OrderServices.cancelOrders(orderID, data)
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Internal server error",
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const response = await OrderServices.getAllOrders();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Internal server error",
    });
  }
};

module.exports = {
  createOrder,
  getAllOrderDetails,
  getOrderDetails,
  cancelOrders,
  getAllOrders,
};
