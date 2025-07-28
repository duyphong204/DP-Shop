const express = require('express');
const router = express.Router();
const CheckoutController = require('../controller/checkoutController');
const {protect} = require('../middleware/authMiddleware');

router.post('/', protect, CheckoutController.createCheckoutSession);
router.put('/:id/pay', protect, CheckoutController.markAsPaid);
router.post('/:id/finalize', protect, CheckoutController.finalizeCheckout);

module.exports = router;    