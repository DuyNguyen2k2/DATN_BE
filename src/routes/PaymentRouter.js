const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");

dotenv.config();

const stripe = require("stripe")(process.env.STRIPE_SECRET)
router.get("/config", (req, res) => {
    return res.status(200).json({
        status: "OK",
        data: process.env.CLIENT_ID
    })
});


module.exports = router;
