const Product = require("../models/ProductModel");
class WebhookService {
  static async processWebhook(requestBody) {
    // Xử lý dữ liệu từ Dialogflow
    // Kiểm tra intent và gửi phản hồi phù hợp
    const intentName = requestBody.queryResult.queryText.toLowerCase();
    const responses = {
      greeting: "Xin chào! Chúng tôi có thể giúp gì cho bạn?",
      default: "Chào bạn! Cảm ơn bạn đã liên hệ.",
      //   productInfo: "Sản phẩm này có giá 1000 đồng và đang còn sẵn hàng.",
      priceQuery: "Bạn muốn hỏi giá của sản phẩm nào?",
    };
    // Kiểm tra nếu intent là 'Xin Chào' và trả lời
    if (["hello", "hi", "xin chào", "chào", "chào bạn"].includes(intentName)) {
      return {
        fulfillmentText: responses.greeting,
      };
    }
    if (
      [
        "chính sách đổi trả",
        "tôi có thể đổi sản phẩm đã mua không?",
        "đổi sản phẩm",
        "chính sách hoàn tiền",
      ].includes(intentName.toLowerCase())
    ) {
      return {
        fulfillmentText:
          "Chúng tôi có chính sách đổi trả trong vòng 30 ngày kể từ ngày nhận hàng nếu sản phẩm bị lỗi do kĩ thuật hoặc vận chuyển.",
      };
    }
    const productQuestionPattern =
      /cửa hàng.*kinh doanh|bạn.*kinh doanh|cửa hàng.*bán gì|bạn.*bán gì|cửa hàng.*bán sản phẩm|bạn.*bán sản phẩm/i;

    // Kiểm tra xem câu hỏi có phù hợp với biểu thức chính quy không
    if (productQuestionPattern.test(intentName)) {
      return {
        fulfillmentText:
          "Chúng tôi hiện đang bán các sản phẩm công nghệ và đồ trang trí nhé.",
      };
    }

    const priceQuestionRegex =
      /(giá\s+của|có\s+giá\s+bao\s+nhiêu|giá\s+nhiêu)\s+(sản\s+phẩm\s+)?([a-zA-Z0-9\s]+)\s*(là\s+bao\s+nhiêu\?|\?)?/i;
    const matchPrice = priceQuestionRegex.exec(intentName);
    if (matchPrice) {
      const productKeyword = matchPrice[3].trim(); // Tên sản phẩm từ câu hỏi (có thể chỉ là phần tên sản phẩm)
      // Tìm kiếm sản phẩm trong cơ sở dữ liệu theo từ khóa
      const products = await Product.find({
        name: { $regex: productKeyword, $options: "i" },
      });

      if (products.length > 0) {
        const product = products[0]; // Giả sử lấy sản phẩm đầu tiên trong danh sách
        return {
          fulfillmentText: `Giá của sản phẩm ${
            product.name
          } là ${product.price.toLocaleString()} VND.`,
        };
      } else {
        return {
          fulfillmentText: `Xin lỗi, tôi không tìm thấy sản phẩm nào phù hợp với từ khóa "${productKeyword}".`,
        };
      }
    }

    const availabilityQuestionRegex =
      /(bạn\s+|cửa\s+hàng\s+có\s+bán\s+|có\s+bán\s+)(sản\s+phẩm\s+)?([a-zA-Z0-9\s]+)\s*(không|\?|\s)*$/i;
    const availabilityMatch = availabilityQuestionRegex.exec(intentName);
    if (availabilityMatch) {
      const productKeyword = availabilityMatch[3].trim();
      console.log("Product Keyword for Availability:", productKeyword);

      const products = await Product.find({
        $or: [
          { name: { $regex: productKeyword, $options: "i" } }, // Tìm theo tên sản phẩm
          { type: { $regex: productKeyword, $options: "i" } }, // Tìm theo loại sản phẩm
        ],
      });

      if (products.length > 0) {
        const productVariants = products.map((p) => p.name).join(", "); // Liệt kê các loại sản phẩm

        return {
          fulfillmentText: `Chúng tôi có bán sản phẩm ${productKeyword}. Các loại có sẵn: ${productVariants}. Nếu bạn muốn biết thông tin về sản phẩm nào hãy nhắn "thông tin sản phẩm + tên sản phẩm"`,
        };
      } else {
        return {
          fulfillmentText: `Xin lỗi, chúng tôi không bán sản phẩm "${productKeyword}".`,
        };
      }
    }

    const productListQuestionPattern =
      /(danh\s+sách\s+các\s+sản\s+phẩm\s+|liệt\s+kê\s+các\s+sản\s+phẩm\s+|danh\s+sách\s+|liệt\s+kê\s+|bạn\s+bán\s+những\s+loại\s+|cửa\s+hàng\s+bán\s+những\s+loại\s+)(.*?)(\s+nào)?$/i;

    const productListMatch = productListQuestionPattern.exec(intentName);
    if (productListMatch) {
      const productKeyword = productListMatch[2].trim(); // Loại bỏ khoảng trắng thừa
      console.log("Product Keyword:", productKeyword);

      // Tìm kiếm sản phẩm theo tên chính xác
      const products = await Product.find({
        $or: [
          { name: { $regex: productKeyword, $options: "i" } }, // Tìm theo tên sản phẩm
          { type: { $regex: productKeyword, $options: "i" } }, // Tìm theo loại sản phẩm
        ],
      });

      if (products && products.length > 0) {
        // Liệt kê tất cả các sản phẩm có tên giống với từ khóa
        const productVariants = products.map((p) => p.name).join(", ");
        return {
          fulfillmentText: `Danh sách các sản phẩm "${productKeyword}": ${productVariants}. Nếu bạn muốn biết thông tin chi tiết về sản phẩm nào hãy nhắn "thông tin sản phẩm + tên sản phẩm"`,
        };
      } else {
        return {
          fulfillmentText: `Xin lỗi, chúng tôi không có sản phẩm "${productKeyword}" trong kho.`,
        };
      }
    }

    const specificProductQuestionPattern =
      /(bạn\s+|cửa\s+hàng\s+có\s+bán\s+)(.*)(\s+không)?/i;
    const specificProductMatch =
      specificProductQuestionPattern.exec(intentName);
    if (specificProductMatch) {
      const specificProductKeyword = specificProductMatch[2].trim(); // Loại bỏ khoảng trắng thừa
      console.log("Specific Product Keyword:", specificProductKeyword);

      // Tìm kiếm sản phẩm theo tên chính xác
      const specificProducts = await Product.find({
        name: { $regex: specificProductKeyword, $options: "i" }, // Tìm theo tên sản phẩm chính xác
      });

      if (specificProducts && specificProducts.length > 0) {
        // Liệt kê tất cả các sản phẩm có tên giống với từ khóa
        const productVariants = specificProducts.map((p) => p.name).join(", ");
        return {
          fulfillmentText: `Chúng tôi có bán các sản phẩm "${specificProductKeyword}". Các sản phẩm có sẵn: ${productVariants}. Nếu bạn muốn biết thông tin chi tiết về sản phẩm nào hãy nhắn "thông tin sản phẩm + tên sản phẩm"`,
        };
      } else {
        return {
          fulfillmentText: `Xin lỗi, chúng tôi không có sản phẩm "${specificProductKeyword}" trong kho.`,
        };
      }
    }

    const bestSellerQuestionPattern =
      /(?:sản\s*phẩm|cửa\s*hàng).*(bán\s*chạy|best\s*seller)|best\s*seller.*(sản\s*phẩm|cửa\s*hàng)/i;
    if (bestSellerQuestionPattern.test(intentName)) {
      // Tìm các sản phẩm bán chạy nhất, có thể theo số lượng bán
      const bestSellers = await Product.find().sort({ selled: -1 }).limit(5); // Giả sử `salesCount` là trường thể hiện số lượng bán
      if (bestSellers.length > 0) {
        const bestSellerDetails = bestSellers
          .map((p) => {
            return `${p.name} - ${p.selled} lượt bán`;
          })
          .join(", ");
        return {
          fulfillmentText: `Các sản phẩm bán chạy nhất của chúng tôi hiện tại là: ${bestSellerDetails}. Nếu bạn muốn biết thông tin chi tiết về sản phẩm nào hãy nhắn "thông tin sản phẩm + tên sản phẩm"`,
        };
      } else {
        return {
          fulfillmentText:
            "Xin lỗi, chúng tôi không có thông tin về sản phẩm bán chạy nhất ngay bây giờ.",
        };
      }
    }

    const topRatedQuestionPattern =
      /(sản\s+phẩm\s+(tốt\s+nhất|được\s+đánh\s+giá\s+tốt|đánh\s+giá\s+cao|cao\s+nhất|sao\s+cao\s+nhất)|cửa\s*hàng\s+(sản\s+phẩm\s+|các\s+|đánh\s+giá\s+)?(tốt\s+nhất|đánh\s+giá\s+tốt|cao\s+nhất|đánh\s+giá\s+cao|sao\s+cao\s+nhất)|top\s+rated|best\s+product|highest\s+rated)/i;
    if (topRatedQuestionPattern.test(intentName)) {
      // Tìm các sản phẩm có đánh giá cao nhất
      const topRatedProducts = await Product.find()
        .sort({ rating: -1 })
        .limit(5); // Giả sử `rating` là trường thể hiện đánh giá
      if (topRatedProducts.length > 0) {
        // Tạo danh sách các sản phẩm với số sao
        const topRatedDetails = topRatedProducts
          .map((p) => {
            const ratingStars = p.rating
              ? `${p.rating}/5 (${p.review_count || 0} đánh giá)`
              : "Chưa có đánh giá";
            return `${p.name} - ${ratingStars}`;
          })
          .join(", ");

        return {
          fulfillmentText: `Các sản phẩm được đánh giá tốt nhất của chúng tôi là: ${topRatedDetails}. Nếu bạn muốn biết thông tin chi tiết về sản phẩm nào hãy nhắn "thông tin sản phẩm + tên sản phẩm"`,
        };
      } else {
        return {
          fulfillmentText:
            "Xin lỗi, chúng tôi không có thông tin về sản phẩm được đánh giá tốt nhất ngay bây giờ.",
        };
      }
    }

    const specificProductDetailPattern =
      /(chi\s+tết\s+sản\s+phẩm|thông\s+tin\s+sản\s+phẩm)\s+([a-zA-Z0-9\s]+)/i;

    const specificProductDetailMatch =
      specificProductDetailPattern.exec(intentName);

    if (specificProductDetailMatch) {
      const productKeyword = specificProductDetailMatch[2].trim(); // Lấy tên sản phẩm từ câu hỏi
      console.log("Product Keyword for Details:", productKeyword);

      // Tìm kiếm sản phẩm trong cơ sở dữ liệu theo tên sản phẩm
      const product = await Product.findOne({
        name: { $regex: productKeyword, $options: "i" },
      });

      if (product) {
        // Kiểm tra số lượng còn hàng
        const availability =
          product.countInStock > 0
            ? `Số lượng hiện tại còn ${product.countInStock} sản phẩm trong kho.`
            : "Sản phẩm này hiện đang hết hàng.";

        return {
          fulfillmentText: `Sản phẩm "${
            product.name
          }" có giá ${product.price.toLocaleString()} VND. Hiện tại ${
            product.name
          } đang được giảm giá ${
            product.discount
          } %. Sản phẩm này được đánh giá ${product.rating}/5 sao với ${
            product.review_count
          } đánh giá từ khách hàng. ${availability}`,
        };
      } else {
        return {
          fulfillmentText: `Xin lỗi, chúng tôi không tìm thấy sản phẩm nào tên "${productKeyword}".`,
        };
      }
    }

    const goodbyePattern =
      /(tạm\s+biệt|chào\s+tạm\s+bệt|hẹn\s+lại|bye|see\s+you|good\s+bye|goodbye)/i;
    if (goodbyePattern.test(intentName)) {
      return {
        fulfillmentText: "Tạm biệt! Cảm ơn bạn đã ghé thăm. Hẹn gặp lại!",
      };
    }
  }
}

module.exports = WebhookService;
