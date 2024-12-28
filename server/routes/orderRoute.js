const e = require("express")
const router = e.Router();

const Order = require('../models/order.js');
const FoodItem = require("../models/food.js")

// Place an order for a food item
router.post('/order', async (req, res) => {
    const { itemId, userId, quantity } = req.body;

    try {
        // Find the food item
        const foodItem = await FoodItem.findById(itemId);
        if (!foodItem) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        // Create a new order
        const order = new Order({
            userId,
            itemId,
            quantity,
            totalPrice: foodItem.price * quantity,
        });

        // Save the order
        const savedOrder = await order.save();
        res.status(201).json({ message: 'Order placed successfully', order: savedOrder });
    } catch (error) {
        res.status(500).json({ message: 'Failed to place order', error });
    }
});


//getordersbyuserid
router.post('/getordersbyuserid', async (req, res) => {
    const { userid } = req.body; // Get the user ID from the request body

    try {
        const orders = await Order.find({ userId: userid }) // Find all orders related to this user
            .populate('itemId', 'name price description') // Populate the itemId field with details from the FoodItem model
            .exec();

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user.' });
        }

        res.status(200).json(orders); // Return the orders as response
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});



router.post('/cancelorder', async (req, res) => {
    const { orderId, foodItemId } = req.body; // Get orderId and foodItemId from the request body

    try {
        // Find the order by orderId
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        // Check if the order's status allows cancellation
        if (order.status !== 'Pending') {
            return res.status(400).json({ message: 'Only pending orders can be cancelled.' });
        }

        // You can also check if the food item matches the one in the order, depending on your use case
        if (!order.itemId.equals(foodItemId)) {
            return res.status(400).json({ message: 'Invalid food item ID.' });
        }

        // Update the order status to 'Cancelled'
        order.status = 'Cancelled';
        await order.save(); // Save the updated order to the database

        res.status(200).json({ message: 'Order cancelled successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Get all orders for the food manager
router.get("/getAllOrders", async (req, res) => {
    try {
        // Fetch all orders from the database
        const orders = await Order.find()
            .populate('userId', 'name email') // Populate the userId with user details
            .populate('itemId', 'name price'); // Populate itemId with food item details

        // Check if there are any orders
        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }

        res.status(200).json(orders); // Return the orders
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;