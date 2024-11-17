const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const EmailServices = require("./EmailServices")

const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
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
      isPaid,
      paidAt,
      email
    } = newOrder;

    try {
      // Check product stock and update inventory
      const updatedProducts = await Promise.all(
        orderItems.map(async (order) => {
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
          return productData ? null : order.product; // Return product ID if out of stock
        })
      );

      const outOfStockItems = updatedProducts.filter((item) => item !== null);
      
      // Handle out-of-stock products
      if (outOfStockItems.length) {
        return resolve({
          status: "ERR",
          message: `Sản phẩm với id ${outOfStockItems.join(", ")} không đủ hàng`,
        });
      }

      // Create the order
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
        isPaid,
        paidAt
      });
      
      // Send confirmation email only if the order was created successfully
      if (createdOrder) {
        await EmailServices.sendEmail(
          orderItems,
          shippingPrice,
          totalPrice,
          fullName,
          address,
          district,
          commune,
          city,
          phone,
          email
        );

        // Resolve the promise with success status
        return resolve({
          status: "OK",
          message: "Order created successfully",
          data: createdOrder,
        });
      } else {
        return resolve({
          status: "ERR",
          message: "Order creation failed",
        });
      }

    } catch (e) {
      reject(e);
    }
  });
};



const getAllOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.find({
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

const getOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById({
        _id: id,
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

// const cancelOrders = (id, data) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       // const order = await Order.findByIdAndDelete(id);
//       // if (order === null) {
//       //   resolve({
//       //     status: "ERR",
//       //     message: "Order does not exists",
//       //   });
//       // }


//       // resolve({
//       //   status: "OK",
//       //   message: "Order deleted successfully",
//       // });

//       const promises = data.orderItems.map(async (order) => {
//         const productData = await Product.findOneAndUpdate(
//           {
//             _id: order?.product,
            
//           },
//           {
//             $inc: {
//               countInStock: +order?.amount,
//               selled: -order?.amount,
//             },
//           },
//           { new: true }
//         );
//         console.log("productData", productData);
//         if (productData) {
//           const order = await Order.findByIdAndDelete(id);
//           if (order === null) {
//             resolve({
//               status: "ERR",
//               message: "Order does not exists",
//             });
//           }
//         } else {
//           return {
//             status: "OK",
//             message: "ERR",
//             id: order.product,
//           };
//         }
//       });
//       const result = await Promise.all(promises);
//       const newData = result && result.filter((item) => item.id);
//       if (newData.length) {
//         resolve({
//           status: "ERR",
//           message: `Sản phẩm với id ${newData.join(",")} không tồn tại`,
//         });
//       }
//       resolve({
//         status: "OK",
//         message: "Hủy đơn hàng thành công",
//         data: order
//       });
//     } catch (e) {
//       reject(e);
//     }
//   });
// };
const cancelOrders = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const promises = data.map(async (order) => {
        // console.log("Processing order item:", order);
        const productData = await Product.findOneAndUpdate(
          {
            _id: order?.product,
          },
          {
            $inc: {
              countInStock: +order?.amount,
              selled: -order?.amount,
            },
          },
          { new: true }
        );
        
        // Trả về null nếu không tìm thấy sản phẩm hoặc sản phẩm không tồn tại
        return productData ? null : order.product;
      });

      const result = await Promise.all(promises);
      const outOfStockItems = result.filter((item) => item !== null);
      
      if (outOfStockItems.length) {
        return resolve({
          status: "ERR",
          message: `Sản phẩm với id ${outOfStockItems.join(", ")} không tồn tại`,
        });
      }

      // Xóa đơn hàng sau khi khôi phục tồn kho thành công
      const order = await Order.findByIdAndDelete(id);
      if (!order) {
        return resolve({
          status: "ERR",
          message: "Order does not exist",
        });
      }

      resolve({
        status: "OK",
        message: "Hủy đơn hàng thành công",
      });

    } catch (e) {
      reject(e);
    }
  });
};

const getAllOrders = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allOrders = await Order.find();

      resolve({
        status: "OK",
        message: "Get all orders successfully",
        data: allOrders,
      });
    } catch (e) {
      reject(e);
    }
  });
};


module.exports = {
  createOrder,
  getAllOrderDetails,
  getOrderDetails,
  cancelOrders,
  getAllOrders
};
