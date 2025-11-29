require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const connectDB = require('./config/db');
const recipeRoutes = require('./routes/recipeRoutes');
const errorHandler = require('./middleware/errorHandler');

// Load Swagger document
const swaggerDocs = YAML.load(path.resolve(__dirname, 'docs', 'swagger.yaml')); 

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Middleware
app.use(helmet());
app.use(cors());
app.use(express.json()); // Body parser

// 1. Routes
// All recipe routes are mounted under /api/v1/recipes
app.use('/api/v1/recipes', recipeRoutes);

// 2. Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 3. Error Handler (MUST be last middleware)
app.use(errorHandler);

//this is a comment
// Start Server & Database Connection
connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`)
  );
}).catch(error => {
    console.error(`Failed to start server: ${error.message}`);
});