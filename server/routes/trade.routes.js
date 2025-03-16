import express from 'express';
import { 
    createTradeRequest, 
    getTradeRequests, 
    matchTradeRequest 
} from '../controllers/carbonTrade.controllers.js';
import { 
    submitCO2Consumption, 
    verifyCO2Consumption,
    getOrganizationCO2Reports
} from '../controllers/co2Consumption.controllers.js';
import { authenticateToken } from '../middlewares/auth.middlewares.js';
import { validateTradeRequest } from '../middlewares/trade.middlewares.js';

const router = express.Router();
router.post('/trade-request', authenticateToken, validateTradeRequest, createTradeRequest);
router.get('/trade-requests', authenticateToken, getTradeRequests);
router.patch('/match-trade/:requestId', authenticateToken, matchTradeRequest);

router.post('/submit-co2', authenticateToken, submitCO2Consumption);
router.patch('/verify-co2/:id', authenticateToken, verifyCO2Consumption);
router.get('/co2-reports', authenticateToken, getOrganizationCO2Reports);

export default router;