const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");

const { authUserMiddleware } = require("../middlewares/authMiddleware");

router.post("/create", authUserMiddleware, OrderController.createOrder);
router.get("/getAllOrder/:id", authUserMiddleware, OrderController.getAllOderDetails);
router.get("/getOrderDetails/:id", authUserMiddleware, OrderController.getOrderDetails);
router.delete("/cancel-order/:id", authUserMiddleware, OrderController.cancelOrders);
module.exports = router;
