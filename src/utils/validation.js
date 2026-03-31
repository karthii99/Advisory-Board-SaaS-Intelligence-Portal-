const Joi = require('joi');

const clientSchemas = {
  createClient: Joi.object({
    name: Joi.string().min(2).max(255).required(),
    industry: Joi.string().min(2).max(100).required(),
    overview: Joi.string().min(10).max(1000).required(),
    details: Joi.object({
      offerings: Joi.array().items(Joi.string().min(1).max(200)).optional(),
      capabilities: Joi.array().items(Joi.string().min(1).max(200)).optional(),
      benefits: Joi.array().items(Joi.string().min(1).max(300)).optional(),
      differentiators: Joi.array().items(Joi.string().min(1).max(300)).optional(),
      pricing: Joi.string().max(500).allow('').optional()
    }).optional()
  }),

  updateClient: Joi.object({
    name: Joi.string().min(2).max(255).optional(),
    industry: Joi.string().min(2).max(100).optional(),
    overview: Joi.string().min(10).max(1000).optional()
  }),

  id: Joi.object({
    id: Joi.number().integer().positive().required()
  })
};

const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property]);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Invalid request data',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        })),
        timestamp: new Date().toISOString()
      });
    }
    
    req[property] = value;
    next();
  };
};

module.exports = {
  clientSchemas,
  validateRequest
};
