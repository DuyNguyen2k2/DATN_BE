const express = require('express');
const router = express.Router();
const WebhookController = require('../controllers/WebhookController');

// Ví dụ, webhook nhận dữ liệu POST từ một dịch vụ bên ngoài
router.post('/webhook', WebhookController.handleWebhook);

module.exports = router;
