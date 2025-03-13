import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';
dotenv.config();

export const validateRegistration = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/\d/).withMessage('Password must contain a number')
        .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter'),
    body('org_name').not().isEmpty().withMessage('Organization name is required'),
    body('org_type').isIn([
        'NGO', 'Oil & Gas', 'Steel & Cement', 
        'Renewable Energy', 'Recycling & Waste Management', 
        'Aviation & Shipping'
    ]).withMessage('Invalid organization type'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export const validateLogin = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').not().isEmpty().withMessage('Password is required'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];