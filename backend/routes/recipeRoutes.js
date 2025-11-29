const express = require('express');
const router = express.Router();
const {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipesByUser,
  searchRecipes,
  getPopularRecipes,
} = require('../controllers/recipeController');

// Define all routes
router.get('/', getAllRecipes); // /api/v1/recipes
router.post('/', createRecipe); // /api/v1/recipes

router.get('/user/:userId', getRecipesByUser); // /api/v1/recipes/user/:userId
router.get('/search', searchRecipes); // /api/v1/recipes/search?q=
router.get('/popular', getPopularRecipes); // /api/v1/recipes/popular

router.get('/:id', getRecipeById); // /api/v1/recipes/:id
router.put('/:id', updateRecipe); // /api/v1/recipes/:id
router.delete('/:id', deleteRecipe); // /api/v1/recipes/:id

module.exports = router;