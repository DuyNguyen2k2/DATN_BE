
const WebhookServices = require('../services/WebhookServices');

class WebhookController {
  static async handleWebhook(req, res) {
    try {
        // console.log('req', req.body);
        const response = await WebhookServices.processWebhook(req.body);
        // console.log('response', req.body)
        return res.json(response);
      } catch (error) {
        console.error('Error handling webhook:', error);
        return res.status(500).json({ fulfillmentText: "Đã có lỗi xảy ra khi xử lý webhook." });
      }
  }
}

module.exports = WebhookController;
