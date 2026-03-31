const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      error: 'Rate Limit Exceeded',
      message,
      timestamp: new Date().toISOString()
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// General API rate limiting
const apiLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests per window
  'Too many requests from this IP, please try again after 15 minutes'
);

// Strict rate limiting for AI endpoints
const aiLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  10, // 10 requests per hour
  'Too many AI enhancement requests, please try again after 1 hour'
);

// Seeding endpoint rate limiting (more lenient for development)
const seedLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  10, // 10 requests per minute (reasonable for testing)
  'Too many seeding attempts, please try again after 1 minute'
);

module.exports = {
  apiLimiter,
  aiLimiter,
  seedLimiter
};
