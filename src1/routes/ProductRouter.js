const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");

const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/create", ProductController.createProduct);
router.put("/update/:id", authMiddleware, ProductController.updateProduct);
router.get("/getOne/:id", ProductController.getOneProduct);
router.delete("/delete/:id", authMiddleware, ProductController.deleteProduct);
router.get("/getAll", ProductController.getAllProduct);
router.post("/delete-many", authMiddleware, ProductController.deleteManyProducts);
router.get("/get-AllType", ProductController.getAllType);

module.exports = router;
