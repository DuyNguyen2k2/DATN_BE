const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: process.env.MAIL_ACCOUNT,
    pass: process.env.MAIL_PASSWORD,
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(
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
) {
  try {
    // Send mail with the defined transport object
    const info = await transporter.sendMail({
      from: `"TechTroveDecor 👻" <${process.env.MAIL_ACCOUNT}>`, // sender address
      to: email, // recipient email
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
            Giảm giá: ${item.discount} %<br>
            Tổng: ${(
              item.price * item.amount - (item.price * item.discount) / 100
            ).toLocaleString("vi-VN")}
          </li>
        `
          )
          .join("")}
      </ul>

      <p style="font-size: 16px;"><strong>Tổng tiền:</strong> ${totalPrice.toLocaleString("vi-VN")} VND</p>

      <h3 style="font-size: 18px;">Thông tin giao hàng</h3>
      <p style="font-size: 16px;">
        <strong>Địa chỉ: </strong> ${
          address + ", " + commune + ", " + district + ", " + city
        }<br>
        <strong>Số điện thoại: </strong> 0${phone}<br>
        <strong>Phí giao hàng: </strong> ${shippingPrice.toLocaleString("vi-VN")} VND
      </p>

      <p style="font-size: 16px;">Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua email này hoặc số điện thoại hỗ trợ của chúng tôi.</p>

      <p style="font-size: 16px;">Trân trọng,<br>Đội ngũ hỗ trợ khách hàng</p>
    `,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}


// sendMail().catch(console.error);

module.exports = {
  sendMail,
};
