import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { ErrorResponse } from '../utils';

// Validation rules for snippets
export const validateSnippet = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1-100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  
  body('language')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Language is required and must be less than 50 characters'),
  
  body('code')
    .trim()
    .isLength({ min: 1, max: 50000 })
    .withMessage('Code is required and must be less than 50,000 characters'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Each tag must be between 1-30 characters'),
];

// Validation rules for AI requests
export const validateAIRequest = [
  body('code')
    .trim()
    .isLength({ min: 1, max: 10000 })
    .withMessage('Code is required and must be less than 10,000 characters'),
  
  body('language')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Language must be less than 50 characters'),
];

// Middleware to handle validation errors
export const handleValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return next(new ErrorResponse(400, errorMessages.join(', ')));
  }
  
  next();
};
