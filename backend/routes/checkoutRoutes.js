const express = require('express');
const router = express.Router();
const CheckoutController = require('../controller/checkoutController');
const {protect} = require('../Middleware/authMiddleware');
const {validateCheckout} = require('../Middleware/checkoutValidation');


router.post('/', protect,validateCheckout, CheckoutController.createCheckoutSession);
router.put('/:id/pay', protect, CheckoutController.markAsPaid);
router.post('/:id/finalize', protect, CheckoutController.finalizeCheckout);

module.exports = router;    