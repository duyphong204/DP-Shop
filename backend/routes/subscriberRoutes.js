const express = require('express');
const router = express.Router();
const subscriberController = require('../controller/subscriberController');


router.post('/', subscriberController.createSubscriber);
module.exports = router;