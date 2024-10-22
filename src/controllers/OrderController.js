const OrderServices = require("../services/OrderServices");

const createOrder = async (req, res) => {
  try {
    console.log("first", req.body);
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
    
    const missingFields = [];

    // Kiểm tra từng trường và log ra nếu bị thiếu
    if (!paymentMethod) missingFields.push("paymentMethod");
    if (!itemsPrice) missingFields.push("itemsPrice");
    
    if (!totalPrice) missingFields.push("totalPrice");
    if (!fullName) missingFields.push("fullName");
    if (!address) missingFields.push("address");
    if (!district) missingFields.push("district");
    if (!commune) missingFields.push("commune");
    if (!city) missingFields.push("city");
    if (!phone) missingFields.push("phone");

    // Nếu có trường nào bị thiếu, log ra và trả về response với thông báo chi tiết
    if (missingFields.length > 0) {
      console.log("Missing fields: ", missingFields);
      return res.status(200).json({
        status: "ERR",
        message: `The following fields are missing: ${missingFields.join(", ")}`,
      });
    }
    
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

const getAllOderDetails = async (req, res) => {
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

module.exports = {
  createOrder,
  getAllOderDetails,
  getOrderDetails
};
