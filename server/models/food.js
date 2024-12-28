const mongoose = require('mongoose');

// Define the schema for a food item
const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // Basic URL validation for image
        return /^(https?:\/\/).+\.(jpg|jpeg|png|webp|gif)$/.test(v);
      },
      message: (props) => `${props.value} is not a valid image URL!`,
    },
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Create the model for the schema
const FoodItem = mongoose.model('FoodItem', foodItemSchema);

module.exports = FoodItem;
