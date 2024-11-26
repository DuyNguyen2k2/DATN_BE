const UserRouter = require('./UserRouter')
const ProductRouter = require('./ProductRouter') 
const OrderRouter = require('./OrderRouter')
const PaymentRouter = require('./PaymentRouter')
const ReviewRouter =  require('./ReviewRouter')
const WebhookRouter = require('./WebhookRouter')
const routes = (app) => {
    app.use('/api/user', UserRouter);
    app.use('/api/product', ProductRouter);
    app.use('/api/order', OrderRouter);
    app.use('/api/payment', PaymentRouter);
    app.use('/api/review', ReviewRouter);
    app.use('/api', WebhookRouter); // Add WebhookRouter here
}

module.exports = routes