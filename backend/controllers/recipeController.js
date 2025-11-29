const Recipe = require('../models/Recipe');
const asyncHandler = require('express-async-handler'); // Simple utility for try/catch

// @desc    GET /api/v1/recipes
// @access  Public
exports.getAllRecipes = asyncHandler(async (req, res, next) => {
  const recipes = await Recipe.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: recipes.length, data: recipes });
});

// @desc    GET /api/v1/recipes/:id
// @access  Public
exports.getRecipeById = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id);
  
  if (!recipe) {
    return res.status(404).json({ success: false, error: 'Recipe not found' });
  }
  // Optional: Increment view count here
  recipe.views += 1;
  await recipe.save();

  res.status(200).json({ success: true, data: recipe });
});

// @desc    POST /api/v1/recipes
// @access  Private (Needs User Authentication)
exports.createRecipe = asyncHandler(async (req, res, next) => {
  // In a real app, req.body.user would come from an authentication middleware
  // For this project, you can set a default mock user ID temporarily
  req.body.user = req.body.user || '60d0fe4f1a2e76313b1f501e'; 

  const recipe = await Recipe.create(req.body);
  res.status(201).json({ success: true, message: "Recipe created", data: recipe });
});

// @desc    PUT /api/v1/recipes/:id
// @access  Private (Needs User Authentication & Ownership Check)
exports.updateRecipe = asyncHandler(async (req, res, next) => {
  let recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return res.status(404).json({ success: false, error: 'Recipe not found' });
  }

  // In a real app, you would check if the recipe.user matches the logged-in user
  recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true // Enforce schema validation on update
  });

  res.status(200).json({ success: true, message: "Recipe updated", data: recipe });
});

// @desc    DELETE /api/v1/recipes/:id
// @access  Private (Needs User Authentication & Ownership Check)
exports.deleteRecipe = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return res.status(404).json({ success: false, error: 'Recipe not found' });
  }

  // In a real app, you would check ownership
  await recipe.deleteOne();

  res.status(200).json({ success: true, message: "Recipe deleted" });
});

// @desc    GET /api/v1/recipes/user/:userId
// @access  Public
exports.getRecipesByUser = asyncHandler(async (req, res, next) => {
  const recipes = await Recipe.find({ user: req.params.userId }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: recipes.length, data: recipes });
});

// @desc    GET /api/v1/recipes/search?q=query
// @access  Public
exports.searchRecipes = asyncHandler(async (req, res, next) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ success: false, error: 'Query parameter "q" is required' });
  }
  
  // Search title, ingredients, and category using $or and regex
  const recipes = await Recipe.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { ingredients: { $regex: query, $options: 'i' } },
      { category: { $regex: query, $options: 'i' } }
    ]
  });

  res.status(200).json({ success: true, count: recipes.length, data: recipes });
});

// @desc    GET /api/v1/recipes/popular
// @access  Public
exports.getPopularRecipes = asyncHandler(async (req, res, next) => {
  // Finds top 10 recipes based on combined likes and views
  const recipes = await Recipe.find().sort({ likes: -1, views: -1 }).limit(10);
  res.status(200).json({ success: true, count: recipes.length, data: recipes });
});