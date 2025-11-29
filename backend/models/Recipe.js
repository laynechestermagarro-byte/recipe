const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title for the recipe'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  ingredients: {
    type: [String], // Array of strings
    required: [true, 'Please add ingredients'],
  },
  steps: {
    type: [String], // Array of strings
    required: [true, 'Please add cooking steps'],
  },
  category: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'],
    default: 'Dinner'
  },
  user: {
    // Assuming you'll have a User model eventually
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Recipe must belong to a user']
  },
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Recipe', RecipeSchema);