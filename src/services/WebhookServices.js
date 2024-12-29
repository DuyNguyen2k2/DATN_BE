
const Product = require("../models/ProductModel");

class WebhookService {
  static async processWebhook(requestBody) {
    // Xử lý dữ liệu từ Dialogflow
    // Kiểm tra intent và gửi phản hồi phù hợp
    const intentName = requestBody.queryResult.queryText.toLowerCase();
    const productName = requestBody.queryResult.parameters.product;
    const typeProduct = requestBody.queryResult.parameters.typeProduct;
    let price = requestBody.queryResult.parameters.price;
    const type = requestBody.queryResult.parameters.type;
    // console.log("typeProduct", typeProduct);
    // let inforProduct = requestBody.queryResult.parameters.infor;
    // console.log("productName", productName);

    const isPriceQuery = intentName.includes("giá");
    const isImageQuery = intentName.includes("ảnh");
    const isInforQuery =
      intentName.includes("thông tin") || intentName.includes("chi tiết");
    const isBestSeller =
      intentName.includes("bán chạy") || intentName.includes("best seller");
    const isToprated =
      intentName.includes("đánh giá") || intentName.includes("rate");

    const isTypeProduct =
      intentName.includes("danh sách") ||
      intentName.includes("liệt kê") ||
      intentName.includes("có bán");
    // console.log("typeProduct", isTypeProduct);

    if (Array.isArray(price)) {
      price = price[0]; // Lấy phần tử đầu tiên trong mảng nếu 'price' là một mảng
    }

    // console.log("Price:", price); // In giá trị của parameter 'price'
    // console.log("Type:", type); // In giá trị của parameter 'type'
    // console.log(isToprated);
    if (isPriceQuery && productName) {
      try {
        // Tìm sản phẩm trong MongoDB
        const product = await Product.findOne({
          name: new RegExp(productName, "i"),
        });
        // console.log('product', product)
        if (product) {
          // Trả về giá của sản phẩm

          // Trả về văn bản và ảnh của sản phẩm trong các fulfillmentMessages
          return {
            // Phần trả về tin nhắn rich message
            fulfillmentMessages: [
              {
                text: {
                  text: [
                    product.discount > 0
                      ? `Giá của **${
                          product.name
                        }** là ${product.price.toLocaleString()} VND. Hiện đang giảm giá **${
                          product.discount
                        }%**, còn **${(
                          product.price *
                          (1 - product.discount / 100)
                        ).toLocaleString()} VND**.`
                      : `Giá của **${
                          product.name
                        }** là ${product.price.toLocaleString()} VND.`,
                  ],
                },
              },
            ],
          };
        } else {
          return {
            fulfillmentText:
              "Sản phẩm không tìm thấy hoặc giá chưa được cập nhật.",
          };
        }
      } catch (error) {
        console.error(error);
        return {
          fulfillmentText: "Có lỗi xảy ra khi lấy thông tin sản phẩm.",
        };
      }
    } else if (isImageQuery && productName) {
      try {
        // Tìm sản phẩm trong MongoDB
        const product = await Product.findOne({
          name: new RegExp(productName, "i"),
        });
        // console.log('product', product)
        if (product) {
          // Trả về ảnh của sản phẩm
          return {
            fulfillmentMessages: [
              {
                text: {
                  text: [`Dưới đây là ảnh của ${product.name}`],
                },
              },
              {
                payload: {
                  richContent: [
                    [
                      {
                        type: "image",
                        rawUrl: product.image, // URL của ảnh từ backend
                        accessibilityText: `Ảnh của ${product.name}`,
                      },
                    ],
                  ],
                },
              },
            ],
          };
        }
      } catch {
        console.error(error);
        return {
          fulfillmentText: "Có lỗi xảy ra khi lấy thông tin sản phẩm.",
        };
      }
    } else if (isInforQuery && productName) {
      try {
        // Tìm sản phẩm trong MongoDB
        const product = await Product.findOne({
          name: new RegExp(productName, "i"),
        });
        // console.log('product', product)
        if (product) {
          // Trả về thông tin sản phẩm
          return {
            fulfillmentMessages: [
              {
                payload: {
                  richContent: [
                    [
                      {
                        type: "image",
                        rawUrl: product.image, // URL của ảnh từ backend
                        accessibilityText: `Ảnh của ${product.name}`,
                      },
                      {
                        type: "info",
                        title: `${product.name}`, // Tên sản phẩm làm tiêu đề
                        subtitle: `
                          Giá gốc: ${product.price.toLocaleString()} VND
                          Giảm giá: ${product.discount}%
                          Giá sau giảm: ${(product.price * (1 - product.discount / 100)).toLocaleString()} VND
                          Được đánh giá: ${product.rating || 0}/5 sao bởi ${product.review_count || 0} người dùng
                          Tình trạng: ${product.countInStock > 0 ? "Đang còn hàng" : "Đã hết hàng"}
                        `, // Nội dung thông tin sản phẩm
                      },
                    ],
                  ],
                },
              },
            ]
          };
        } else {
          return {
            fulfillmentText:
              "Sản phẩm không tìm thấy hoặc thông tin chưa được cập nhật.",
          };
        }
      } catch (error) {
        console.error(error);
        return {
          fulfillmentText: "Có lỗi xảy ra khi lấy thông tin sản phẩm.",
        };
      }
    } else if (isBestSeller) {
      try {
        const topProducts = await Product.find()
          .sort({ selled: -1 }) // Sắp xếp giảm dần theo trường 'selled'
          .limit(5); // Lấy top 5 sản phẩm

        if (topProducts.length > 0) {
          const productList = topProducts
            .map((product) => `+ ${product.name} - ${product.selled} lượt bán`)
            .join("\n"); // Tạo danh sách sản phẩm dưới dạng chuỗi

          return {
            fulfillmentMessages: [
              {
                text: {
                  text: [
                    "Sau đây là top 5 sản phẩm bán chạy nhất tại cửa hàng:\n" +
                      productList,
                  ],
                },
              },
            ],
          };
        } else {
          return {
            fulfillmentText: "Hiện tại chưa có sản phẩm bán chạy nào.",
          };
        }
      } catch (error) {
        console.error(error);
        return {
          fulfillmentText: "Có lỗi xảy ra khi lấy danh sách sản phẩm bán chạy.",
        };
      }
    } else if (isToprated) {
      try {
        const topProducts = await Product.find()
          .sort({ rating: -1 }) // Sắp xếp giảm dần theo trường 'selled'
          .limit(5); // Lấy top 5 sản phẩm

        if (topProducts.length > 0) {
          const productList = topProducts
            .map(
              (product) =>
                `+ ${product.name} - ${product.rating || 0}/5 sao (${
                  product.review_count || 0
                } lượt đánh giá)`
            )
            .join("\n"); // Tạo danh sách sản phẩm dưới dạng chuỗi

          return {
            fulfillmentMessages: [
              {
                text: {
                  text: [
                    "Sau đây là top 5 sản phẩm có đánh giá cao nhất tại cửa hàng:\n" +
                      productList,
                  ],
                },
              },
            ],
          };
        } else {
          return {
            fulfillmentText: "Hiện tại chưa có sản phẩm được đánh giá cao nào.",
          };
        }
      } catch (error) {
        console.error(error);
        return {
          fulfillmentText:
            "Có lỗi xảy ra khi lấy danh sách sản phẩm có đánh giá cao.",
        };
      }
    } else if (price && type) {
      // Tiến hành xử lý với giá trị của price và type
      // Ví dụ: Truy vấn sản phẩm theo giá và loại sản phẩm
      try {
        // Tìm sản phẩm có giá <= price (sau giảm giá)
        const products = await Product.find({
          type: { $regex: new RegExp(type, "i") },
        });

        // Lọc các sản phẩm có giá sau giảm <= ngân sách của người dùng
        const filteredProducts = products.filter((product) => {
          const finalPrice = product.discount
            ? product.price - (product.price * product.discount) / 100
            : product.price;
          return finalPrice <= parseFloat(price); // So sánh giá sau giảm với ngân sách
        });

        if (filteredProducts.length > 0) {
          // Trả về danh sách sản phẩm phù hợp với yêu cầu
          const productList = filteredProducts
            .map((product) => {
              const price = parseFloat(product.price); // Đảm bảo giá là số
              const discount = parseFloat(product.discount); // Đảm bảo giảm giá là số

              // Kiểm tra nếu giá trị hợp lệ
              if (isNaN(price) || (discount && isNaN(discount))) {
                return `- ${product.name} (Giá không hợp lệ)`;
              }

              const finalPrice = discount
                ? price - (price * discount) / 100
                : price;

              return `- ${product.name} (Giá: ${price.toLocaleString()} VND. ${
                discount
                  ? `Hiện đang giảm giá: ${discount}% còn ${finalPrice.toLocaleString()} VND`
                  : ""
              })`;
            })
            .join("\n");

          return {
            fulfillmentText: `Dưới đây là các sản phẩm phù hợp với giá và loại bạn yêu cầu:\n${productList}`,
          };
        } else {
          return {
            fulfillmentText: `Không tìm thấy sản phẩm nào với giá và loại bạn yêu cầu.`,
          };
        }
      } catch (error) {
        console.error(error);
        return {
          fulfillmentText: "Có lỗi xảy ra khi tìm kiếm sản phẩm.",
        };
      }
    } else if (isTypeProduct && typeProduct) {
      try {
        const products = await Product.find({
          $or:[
            {type: new RegExp(typeProduct, "i")},
            {name: new RegExp(typeProduct, "i")}
          ]
          
        });
        if (products.length > 0) {
          // Liệt kê các sản phẩm theo yêu cầu
          const productList = products
            .map((product) => {
              const stockStatus =
                product.countInStock > 0 ? "Còn hàng" : "Hết hàng";
              return `+ ${
                product.name
              } giá ${product.price.toLocaleString()} VND, hiện đang ${stockStatus}`;
            })
            .join("\n");
          return {
            fulfillmentMessages: [
              {
                text: {
                  text: [
                    `Cửa hàng có bán những sản phẩm loại **${typeProduct}** sau:\n${productList}`,
                  ],
                },
              },
            ],
          };
        } else {
          return {
            fulfillmentText: `Không tìm thấy sản phẩm nào thuộc loại **${typeProduct}**.`,
          };
        }
      } catch (error) {
        console.error(error);
        return {
          fulfillmentText: "Có lỗi xảy ra khi tìm kiếm sản phẩm.",
        };
      }
    } 
    
    
    
    
    
    else {
      return {
        fulfillmentText: "Tôi không hiểu câu hỏi của bạn. Vui lòng thử lại.",
      };
    }
  }
}

module.exports = WebhookService;
