const Subcriber = require('../models/subscriber');

const subscriberController = {
    createSubscriber: async (req, res) => {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        try {
            // Check if the email already exists
            const existingSubscriber = await Subcriber.findOne({ email });
            if (existingSubscriber) {
                return res.status(400).json({ message: "Email already subscribed" });
            }

            // Create a new subscriber
            const newSubscriber = new Subcriber({ email });
            await newSubscriber.save();

            return res.status(201).json({ message: "Subscription successful",newSubscriber });
        }
        catch (error) {
            return res.status(500).json({ message: "Server error", error: error.message });
        }
    }
}

module.exports = subscriberController;