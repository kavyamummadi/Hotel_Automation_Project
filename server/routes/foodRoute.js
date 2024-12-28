const express = require('express');
const FoodItem = require('../models/food.js');

const router = express.Router();

// Fetch all food items
router.get('/', async (req, res) => {
  try {
    const foodItems = await FoodItem.find();
    res.status(200).json(foodItems);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch food items', error });
  }
});

// Fetch a food item by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const foodItem = await FoodItem.findById(id);
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.status(200).json(foodItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch food item', error });
  }
});

// Add a new food item
router.post('/', async (req, res) => {
  const { name, price, description, image } = req.body;
  try {
    const newFoodItem = new FoodItem({ name, price, description, image });
    const savedFoodItem = await newFoodItem.save();
    res.status(201).json(savedFoodItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add food item', error });
  }
});

// Update an existing food item
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, description, image } = req.body;
  try {
    const updatedFoodItem = await FoodItem.findByIdAndUpdate(
      id,
      { name, price, description, image },
      { new: true, runValidators: true }
    );
    if (!updatedFoodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.status(200).json(updatedFoodItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update food item', error });
  }
});

// Delete a food item
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedFoodItem = await FoodItem.findByIdAndDelete(id);
    if (!deletedFoodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.status(200).json({ message: 'Food item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete food item', error });
  }
});



module.exports = router;
