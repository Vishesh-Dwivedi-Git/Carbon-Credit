import CarbonTradeRequest from '../models/carbonTradeRequest.models.js';
import Org from '../models/org.models.js';
import dotenv from 'dotenv';
import { tradingContract } from '../utils/blockchain.js';
dotenv.config();

export async function createTradeRequest(req, res, next) {
    try {
        const { requestType, carbonTokenAmount, pricePerToken } = req.body;    //for the sell trade Request Approve the contract address for the seller's wallet for the Amount
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
        const { requestId } = req.params; // requestId is now treated as the seller's userId
        const buyerId = req.user.id;

        const sellerTradeRequest = await CarbonTradeRequest.findOne({
            requester: requestId, // Changed to filter by seller's userId
            requestType: 'SELL',
            status: 'PENDING'
        });

        const buyerTradeRequest = await CarbonTradeRequest.findOne({
            requester: buyerId,
            requestType: 'BUY',
            status: 'PENDING'
        });

        if (!sellerTradeRequest || !buyerTradeRequest) {
            return res.status(404).json({ message: 'Matching trade requests not found or invalid status/type' });
        }

        const seller = await Org.findById(requestId);
        const buyer = await Org.findById(buyerId);

        if (!seller || !buyer) {
            return res.status(404).json({ message: 'Seller or buyer organization not found' });
        }

        const sellerWallet = seller.walletAddress;
        const buyerWallet = buyer.walletAddress;

        const cctAmountSeller = sellerTradeRequest.cctAmount;
        const cctAmountBuyer = buyerTradeRequest.cctAmount;
        const pricePerTokenSeller = sellerTradeRequest.pricePerToken;
        const pricePerTokenBuyer = buyerTradeRequest.pricePerToken;

        if (cctAmountSeller !== cctAmountBuyer || pricePerTokenSeller !== pricePerTokenBuyer) {
            return res.status(400).json({ message: 'CCT amount or price per token mismatch' });
        }

        // Execute trade via smart contract
        try {
            const tx = await tradingContract.executeTrade( //need to approve the contract address for the seller's wallet for the Amount
                sellerWallet,
                buyerWallet,
                cctAmountSeller,
                pricePerTokenSeller
            );
            await tx.wait();

            sellerTradeRequest.status = 'COMPLETED';
            buyerTradeRequest.status = 'COMPLETED';
            sellerTradeRequest.matchedWith = buyerId;
            buyerTradeRequest.matchedWith = seller._id;

            seller.CCtTokens -= cctAmountSeller;
            buyer.CCtTokens += cctAmountBuyer;

            await seller.save();
            await buyer.save();
            await sellerTradeRequest.save();
            await buyerTradeRequest.save();

            res.status(200).json({
                message: 'Trade executed successfully',
                sellerTradeRequest,
                buyerTradeRequest
            });
        } catch (err) {
            console.error("Trade execution failed:", err);
            return res.status(500).json({ message: "Trade execution failed", error: err.message });
        }

    } catch (error) {
        next(error);
    }
}
