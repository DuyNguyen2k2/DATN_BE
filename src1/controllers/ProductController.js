const ProductService = require("../services/ProductService");

const createProduct = async (req, res) => {
  try {
    const { name, image, type, price, countInStock, rating, description } =
      req.body;
    if (
      !name ||
      !image ||
      !type ||
      !price ||
      !countInStock ||
      !rating ||
      !description
    ) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await ProductService.createProduct(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productID = req.params.id;
    const data = req.body;
    if (!productID) {
      return res.status(200).json({
        status: "ERR",
        message: "The product ID is required",
      });
    }
    const response = await ProductService.updateProduct(productID, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getOneProduct = async (req, res) => {
  try {
    const productID = req.params.id;

    if (!productID) {
      return res.status(400).json({
        status: "ERR",
        message: "The product id is required",
      });
    }

    const response = await ProductService.getOneProduct(productID);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Internal server error",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productID = req.params.id;

    if (!productID) {
      return res.status(400).json({
        status: "ERR",
        message: "The product ID is required",
      });
    }

    const response = await ProductService.deleteProduct(productID);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Internal server error",
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const response = await ProductService.getAllProduct(Number(limit), Number(page) || 0, sort, filter);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Internal server error",
    });
  }
};

const getAllType = async (req, res) => {
  try {
    
    const response = await ProductService.getAllType();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Internal server error",
    });
  }
};

const deleteManyProducts = async (req, res) => {
  try {
    const productIDs = req.body.ids;

    if (!productIDs) {
      return res.status(400).json({
        status: "ERR",
        message: "The product IDs is required",
      });
    }

    const response = await ProductService.deleteManyProducts(productIDs);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Internal server error",
    });
  }
};
module.exports = {
  createProduct,
  updateProduct,
  getOneProduct,
  deleteProduct,
  getAllProduct,
  deleteManyProducts,
  getAllType,
};
