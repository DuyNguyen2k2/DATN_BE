const Order = require("../models/OrderModel");

const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    console.log("newOrder", newOrder);
    const {
      orderItems,
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
      user
    } = newOrder;
    try {
      const createdOrder = await Order.create({
        orderItems,
        shippingAddress: {
            fullName,
            address,
            district,
            commune,
            city,
            phone,
        },
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice, 
        user: user,
      });
      if (createdOrder) {
        resolve({
          status: "OK",
          message: "Order created successfully",
          data: createdOrder,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createOrder,
};
