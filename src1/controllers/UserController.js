const UserService = require("../services/UserService");
const JwtService = require("../services/JwtService");


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
};
