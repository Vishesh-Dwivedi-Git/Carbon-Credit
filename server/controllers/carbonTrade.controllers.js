import CarbonTradeRequest from '../models/carbonTradeRequest.models.js';
import Org from '../models/org.models.js';
import dotenv from 'dotenv';
// import { tradingContract } from '../utils/blockchain.js';
// import { ethers } from 'ethers';

dotenv.config();

export async function createTradeRequest(req, res, next) {

    try {
        console.log("inside createTradeRequest");
        const { requestType, carbonTokenAmount, pricePerToken } = req.body;    //for the sell trade Request Approve the contract address for the seller's wallet for the Amount
        const requester = req.user.id; 
        console.log("requester", requester);
        const org = await Org.findById(requester);
        if (!org) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        console.log("org", org);

        const tradeRequest = new CarbonTradeRequest({
            requester,
            requestType,
            carbonTokenAmount,
            pricePerToken
        });

        await tradeRequest.save();
        console.log("tradeRequest", tradeRequest);
        return res.status(201).json({
            message: 'Trade request created successfully',
            tradeRequest
        });
    } catch (error) {
        console.log("error in createTradeRequest", error);
        next(error);
    }
}

export async function getTradeRequests(req, res, next) {
    try {
        console.log("inside getTradeRequests");

        const filter = {
            status: 'PENDING',          // ✅ Include only trades with status "PENDING"
            requester: { $ne: req.user.id }  // ✅ Exclude trades by the current user
        };

        console.log("filter", filter);

        const tradeRequests = await CarbonTradeRequest.find(filter)
            .populate('requester', 'org_name org_type walletAddress')  // ✅ Added walletAddress here
            .sort({ createdAt: -1 });

        console.log("tradeRequests", tradeRequests);

        return res.status(200).json({
            message: 'Pending trade requests retrieved successfully',
            tradeRequests
        });

    } catch (error) {
        console.log("error in getTradeRequests", error);
        next(error);
    }
}

export async function matchTradeRequest(req, res, next) {
    try {
        const { sellerId } = req.body; // sellerId is now treated as the seller's userId
        console.log("[INFO] Received sellerId:", sellerId);

        const buyerId = req.user.id;
        console.log("[INFO] BuyerId:", buyerId);

        // Fetch Seller Trade Request
        const sellerTradeRequest = await CarbonTradeRequest.findOne({
            requester: sellerId, // Filter by seller's userId
            requestType: 'SELL',
            status: 'PENDING'
        });

        if (!sellerTradeRequest) {
            console.warn("[WARN] Matching trade requests not found or invalid status/type");
            return res.status(404).json({ message: 'Matching trade requests not found or invalid status/type' });
        }

        console.log("[INFO] sellerTradeRequest found:", sellerTradeRequest);

        // Fetch seller and buyer organization details
        const seller = await Org.findById(sellerId);
        const buyer = await Org.findById(buyerId);

        if (!seller || !buyer) {
            console.warn("[WARN] Seller or buyer organization not found");
            return res.status(404).json({ message: 'Seller or buyer organization not found' });
        }

        console.log("[INFO] Seller Organization:", seller);
        console.log("[INFO] Buyer Organization:", buyer);

        // Wallet Addresses
        const sellerWallet = seller.walletAddress;
        const buyerWallet = buyer.walletAddress;

        console.log("[INFO] Seller Wallet Address:", sellerWallet);
        console.log("[INFO] Buyer Wallet Address:", buyerWallet);

        // Trade Details
        // const cctAmountSeller = BigInt(sellerTradeRequest.carbonTokenAmount); // Ensure it's BigInt
        const cctAmountSeller = (sellerTradeRequest.carbonTokenAmount);
        const pricePerTokenSeller = parseFloat(sellerTradeRequest.pricePerToken); // Convert to float if needed

        console.log("[INFO] CCT Amount - Seller:", cctAmountSeller);
        console.log("[INFO] Price Per Token - Seller:", pricePerTokenSeller);

        try {
           // Ensure all values are BigInt before multiplication
            // Convert cctAmountSeller to BigInt
            // const pricePerTokenSellerStr = pricePerTokenSeller.toString();
            // const EthPriceInWei = parseUnits(pricePerTokenSellerStr, 18) * BigInt(cctAmountSeller);
            
            // const cctAmountWithDecimals = BigInt(cctAmountSeller) * BigInt(10 ** 18);



            // console.log("[INFO] Executing trade on smart contract...");
            // const tx = await tradingContract.executeTrade(
            //     sellerWallet,
            //     buyerWallet,
            //     cctAmountWithDecimals,
            //     EthPriceInWei
            // );

            // console.log("[INFO] Transaction sent. Waiting for confirmation...");
            // console.log("[DEBUG] Transaction Object:", tx);

            // const receipt = await tx.wait()

            // Update trade status and balances
            sellerTradeRequest.status = 'COMPLETED';
            sellerTradeRequest.matchedWith = buyerId;

            seller.CCtTokens -= cctAmountSeller;
            buyer.CCtTokens += cctAmountSeller; // Fixed reference error

            console.log("[INFO] Updated balances - Seller:", seller.CCtTokens, "| Buyer:", buyer.CCtTokens);

            await seller.save();
            await buyer.save();
            await sellerTradeRequest.save();
            console.log("[SUCCESS] Trade successfully executed and database updated.");

            res.status(200).json({
                message: 'Trade executed successfully',
                sellerTradeRequest,
            });

        } catch (err) {
            console.error("[ERROR] Trade execution failed:", err);
            return res.status(500).json({ message: "Trade execution failed", error: err.message });
        }

    } catch (error) {
        console.error("[ERROR] Unexpected error in matchTradeRequest:", error);
        next(error);
    }
}