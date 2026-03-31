const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    success: false,
    error: 'Internal Server Error',
    message: 'Something went wrong',
    timestamp: new Date().toISOString()
  };

  // Validation error
  if (err.name === 'ValidationError') {
    error = {
      success: false,
      error: 'Validation Error',
      message: err.message,
      details: err.details,
      timestamp: new Date().toISOString()
    };
    return res.status(400).json(error);
  }

  // Database error
  if (err.code && err.code.startsWith('23')) {
    error = {
      success: false,
      error: 'Database Error',
      message: 'Database operation failed',
      timestamp: new Date().toISOString()
    };
    return res.status(500).json(error);
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    error = {
      success: false,
      error: 'Authentication Error',
      message: 'Invalid token',
      timestamp: new Date().toISOString()
    };
    return res.status(401).json(error);
  }

  // Rate limit error
  if (err.status === 429) {
    error = {
      success: false,
      error: 'Rate Limit Exceeded',
      message: 'Too many requests, please try again later',
      timestamp: new Date().toISOString()
    };
    return res.status(429).json(error);
  }

  // Default 500 error
  res.status(500).json(error);
};

module.exports = errorHandler;
