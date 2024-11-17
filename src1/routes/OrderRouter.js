const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");

const { authUserMiddleware, authMiddleware } = require("../middlewares/authMiddleware");

router.post("/create", authUserMiddleware, OrderController.createOrder);
router.get("/getAllOrderDetails/:id", authUserMiddleware, OrderController.getAllOrderDetails);
router.get("/getOrderDetails/:id", authUserMiddleware, OrderController.getOrderDetails);
router.delete("/cancel-order/:id", authUserMiddleware, OrderController.cancelOrders);
router.get("/getAllOrders", authMiddleware, OrderController.getAllOrders);
module.exports = router;
