const errorHandler = (err, req, res, next) => {
    let error = { ...err };
  
    error.message = err.message;
  
    // Log to console for dev
    console.log(err.stack);
  
    // Mongoose Bad ObjectId (404 Not Found)
    if (err.name === 'CastError') {
      error.message = `Resource not found with id of ${err.value}`;
      error.statusCode = 404;
    }
  
    // Mongoose Validation Error (400 Bad Request)
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      error.message = messages.join(', ');
      error.statusCode = 400;
    }
  
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Server Error'
    });
  };
  
  module.exports = errorHandler;