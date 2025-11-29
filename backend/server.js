require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const connectDB = require('./config/db'); // Assuming this function connects to MongoDB
const recipeRoutes = require('./routes/recipeRoutes');
const errorHandler = require('./middleware/errorHandler');

// NOTE: Vercel does not use app.listen(). 
// Instead, we initialize the database connection immediately 
// and export the 'app' instance for Vercel's serverless runtime to handle.

// Database Connection: Connect immediately upon function initialization
connectDB().catch(error => {
    // Log error, but allow app initialization to continue.
    // Vercel will attempt to handle requests, but they will fail if DB is required.
    console.error(`🔴 Initial Database Connection Failed: ${error.message}`);
});


// Load Swagger document
const swaggerDocs = YAML.load(path.resolve(__dirname, 'docs', 'swagger.yaml')); 

const app = express();
// PORT is no longer needed for Vercel, but kept for local development clarity.
// const PORT = process.env.PORT || 3000; 

// --- Middleware ---
app.use(helmet());
app.use(cors());
app.use(express.json()); // Body parser

// 0. Base Route for Health Check (Vercel testing)
app.get('/', (req, res) => {
    // This provides a clear, successful response for Vercel to verify the function is running.
    res.status(200).send('Recipe API is running and ready for Vercel deployment.');
});

// 1. Routes
// All recipe routes are mounted under /api/v1/recipes
app.use('/api/v1/recipes', recipeRoutes);

// 2. Swagger Docs
app.use('/api-docs', swaggAerUi.serve, swaggerUi.setup(swaggerDocs));

// 3. Error Handler (MUST be last middleware)
app.use(errorHandler);


// Vercel Requirement: Export the Express app instance.
// Vercel will handle the request listening, not app.listen().
module.exports = app;

// The previous code block for app.listen() is now completely removed.
/*
connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`)
  );
}).catch(error => {
    console.error(`Failed to start server: ${error.message}`);
});
*/