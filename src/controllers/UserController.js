const UserService = require("../services/UserService");
const EmailService = require("../services/EmailServices");
const JwtService = require("../services/JwtService");
const bcrypt = require("bcrypt");
const crypto = require('crypto');

const createUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const isCheckEmail = reg.test(email);

    if (!name || !email || !password || !confirmPassword || !phone) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is email",
      });
    } else if (password !== confirmPassword) {
      return res.status(200).json({
        status: "ERR",
        message: "Password and confirm password must be the same",
      });
    }
    const response = await UserService.createUser(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const isCheckEmail = reg.test(email);

    if (!email || !password) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "Invalid email format",
      });
    }
    const response = await UserService.loginUser(req.body);
    const { refresh_token, ...newResponse } = response;
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      sercure: false,
      samesite: 'strict'
    });
    return res.status(200).json(newResponse);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userID = req.params.id;
    const data = req.body;
    if (!userID) {
      return res.status(200).json({
        status: "ERR",
        message: "The user id is required",
      });
    }
    const response = await UserService.updateUser(userID, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userID = req.params.id;

    if (!userID) {
      return res.status(400).json({
        status: "ERR",
        message: "The user id is required",
      });
    }

    const response = await UserService.deleteUser(userID);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Internal server error",
    });
  }
};

const deleteManyUsers = async (req, res) => {
  try {
    const userIDs = req.body.ids

    if (!userIDs) {
      return res.status(400).json({
        status: "ERR",
        message: "The user ids is required",
      });
    }

    const response = await UserService.deleteManyUsers(userIDs);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Internal server error",
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const response = await UserService.getAllUser();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Internal server error",
    });
  }
};

const getOneUser = async (req, res) => {
  try {
    const userID = req.params.id;

    if (!userID) {
      return res.status(400).json({
        status: "ERR",
        message: "The user id is required",
      });
    }

    const response = await UserService.getOneUser(userID);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Internal server error",
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refresh_token;
    console.log(token);
    if (!token) {
      return res.status(400).json({
        status: "ERR",
        message: "The token id is required",
      });
    }

    const response = await JwtService.refreshTokenJWTService(token);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Internal server error",
    });
  }
};
const logout = async (req, res) => {
  try {
    res.clearCookie('refresh_token')
    return res.status(200).json({
      status: 'OK',
      message: 'Logged out successfully',
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Internal server error",
    });
  }
};
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // Giả sử bạn đã có middleware xác thực và lưu userId vào req.user
    // console.log("req.body:", JSON.stringify(req.body, null, 2));
    const { oldPassword, newPassword, confirmPassword } = req.body;
    // console.log('old password:', oldPassword)
    // console.log('new password:', newPassword)
    // console.log('confirm password:', confirmPassword)
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        status: "ERR",
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: "ERR",
        message: "New password and confirm password do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        status: "ERR",
        message: "Password must be at least 6 characters",
      });
    }

    // Lấy thông tin người dùng từ DB
    const user = await UserService.getOneUser(userId);
    if (!user) {
      return res.status(404).json({
        status: "ERR",
        message: "User not found",
      });
    }
    // console.log('user', user);
    // console.log("Old Password:", oldPassword);
    // console.log("Stored Hashed Password:", user.password);
    // Kiểm tra mật khẩu cũ
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.data.password);
    console.log('isPasswordMatch', isPasswordMatch);
    if (!isPasswordMatch) {
      return res.status(400).json({
        status: "ERR",
        message: "Old password is incorrect",
      });
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // console.log('hashedPassword', hashedPassword);
    // Cập nhật mật khẩu
    await UserService.updateUser(userId, { password: hashedPassword });

    return res.status(200).json({
      status: "OK",
      message: "Password changed successfully",
    });
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Internal server error",
    });
  }
};

function generateRandomPassword(length = 8) {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "ERR",
        message: "Email is required",
      });
    }

    const user = await UserService.getUserByEmail(email); // Giả sử bạn có service tìm người dùng theo email
    if (!user) {
      return res.status(404).json({
        status: "ERR",
        message: "User not found with this email",
      });
    }

    // Tạo mật khẩu ngẫu nhiên
    const newPassword = generateRandomPassword();

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log('user', user);
    // Cập nhật mật khẩu mới vào cơ sở dữ liệu
    await UserService.updateUser(user.data._id, { password: hashedPassword });

    // Gửi mật khẩu mới qua email
    await EmailService.sendForgotPasswordMail(email, newPassword);

    return res.status(200).json({
      status: "OK",
      message: "New password has been sent to your email",
    });
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Internal server error",
    });
  }
}

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getOneUser,
  refreshToken,
  logout,
  deleteManyUsers,
  changePassword,
  forgotPassword,
};
