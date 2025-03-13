import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';
dotenv.config();

export const validateTradeRequest = [
    body('requestType')
        .isIn(['BUY', 'SELL'])
        .withMessage('Invalid request type. Must be BUY or SELL'),
    
    body('carbonTokenAmount')
        .isFloat({ min: 0 })
        .withMessage('Carbon token amount must be a positive number'),
    
    body('pricePerToken')
        .isFloat({ min: 0 })
        .withMessage('Price per token must be a positive number'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];