const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const sendEmail = async (
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
) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
      user: process.env.MAIL_ACCOUNT,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: `"TechTroveDecor 👻" <${process.env.MAIL_ACCOUNT}>`, // sender address
    to: email, // list of receivers
    subject: "Xác nhận đặt hàng thành công",
    text: `Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi!`,
    html: `
      <h2 style="font-size: 20px;">Xin chào ${fullName},</h2>
      <p style="font-size: 16px;">Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi. Dưới đây là chi tiết đơn hàng của bạn:</p>
      
      <h3 style="font-size: 18px;">Chi tiết đơn hàng</h3>
      <ul style="font-size: 16px; list-style-type: none; padding: 0;">
        ${orderItems
          .map(
            (item) => `
          <li style="margin-bottom: 10px;">
            <strong>${item.name}</strong><br>
            Số lượng: ${item.amount}<br>
            Giá: ${item.price.toLocaleString("vi-VN")} VND<br>
            Giảm giá: ${
              item.discount
                ? item.discount.toLocaleString("vi-VN") + "%"
                : "0 VND"
            }<br>
            Tổng: ${(item.price * item.amount - (item.price*item.discount/100)).toLocaleString(
              "vi-VN"
            )} VND
          </li>
        `
          )
          .join("")}
      </ul>
  
      <p style="font-size: 16px;"><strong>Tổng tiền:</strong> ${totalPrice.toLocaleString(
        "vi-VN"
      )} VND</p>
      
      <h3 style="font-size: 18px;">Thông tin giao hàng</h3>
      <p style="font-size: 16px;">
        <strong>Địa chỉ: </strong> ${
          address + ", " + commune + ", " + district + ", " + city
        }<br>
        <strong>Số điện thoại: </strong> 0${phone}<br>
        <strong>Phí giao hàng: </strong> ${shippingPrice.toLocaleString(
          "vi-VN"
        )} VND
      </p>
  
      <p style="font-size: 16px;">Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua email này hoặc số điện thoại hỗ trợ của chúng tôi.</p>
  
      <p style="font-size: 16px;">Trân trọng,<br>Đội ngũ hỗ trợ khách hàng</p>
    `,
  });
};

module.exports = {
  sendEmail,
};
