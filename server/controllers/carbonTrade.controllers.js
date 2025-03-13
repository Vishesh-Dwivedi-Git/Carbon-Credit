import CarbonTradeRequest from '../models/carbonTradeRequest.models.js';
import Org from '../models/org.models.js';
import dotenv from 'dotenv';
dotenv.config();

export async function createTradeRequest(req, res, next) {
    try {
        const { requestType, carbonTokenAmount, pricePerToken } = req.body;
        const requester = req.user.id; 
        const org = await Org.findById(requester);
        if (!org) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        const tradeRequest = new CarbonTradeRequest({
            requester,
            requestType,
            carbonTokenAmount,
            pricePerToken
        });

        await tradeRequest.save();

        res.status(201).json({
            message: 'Trade request created successfully',
            tradeRequest
        });
    } catch (error) {
        next(error);
    }
}

export async function getTradeRequests(req, res, next) {
    try {
        const { requestType, status } = req.query;
        const filter = {};

        if (requestType) filter.requestType = requestType;
        if (status) filter.status = status;
        filter.requester = { $ne: req.user.id };

        const tradeRequests = await CarbonTradeRequest.find(filter)
            .populate('requester', 'org_name org_type')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: 'Trade requests retrieved successfully',
            tradeRequests
        });
    } catch (error) {
        next(error);
    }
}

export async function matchTradeRequest(req, res, next) {
    try {
        const { requestId } = req.params;
        const matchedBy = req.user.id;
        const tradeRequest = await CarbonTradeRequest.findById(requestId);
        if (!tradeRequest) {
            return res.status(404).json({ message: 'Trade request not found' });
        }
        if (tradeRequest.requester.toString() === matchedBy) {
            return res.status(400).json({ message: 'Cannot match your own trade request' });
        }
        tradeRequest.status = 'MATCHED';
        tradeRequest.matchedWith = matchedBy;

        await tradeRequest.save();

        res.status(200).json({
            message: 'Trade request matched successfully',
            tradeRequest
        });
    } catch (error) {
        next(error);
    }
}