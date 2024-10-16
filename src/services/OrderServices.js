const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");

const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    // console.log("newOrder", newOrder);
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
      user,
    } = newOrder;
    try {
      const promises = orderItems.map(async (order) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: order?.product,
            countInStock: { $gte: order?.amount },
          },
          {
            $inc: {
              countInStock: -order?.amount,
              selled: +order?.amount,
            },
          },
          { new: true }
        );
        console.log("productData", productData);
        if (productData) {
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
            return {
              status: "OK",
              message: "Order created successfully",
              // data: createdOrder,
            };
          }
        } else {
          return {
            status: "OK",
            message: "ERR",
            id: order.product,
          };
        }
      });
      const result = await Promise.all(promises);
      const newData = result && result.filter((item) => item.id);
      if (newData.length) {
        resolve({
          status: "ERR",
          message: `Sản phẩm với id ${newData.join(",")} không đủ hàng`,
        });
      }
      resolve({
        status: "OK",
        message: "Tạo đơn hàng thành công",
      });
      console.log("result", result);
    } catch (e) {
      reject(e);
    }
  });
};

const getOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findOne({
        user: id,
      });
      if (order === null) {
        resolve({
          status: "ERR",
          message: "Order does not exists",
        });
      }
      resolve({
        status: "OK",
        message: "Get order successfully",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createOrder,
  getOrderDetails,
};
