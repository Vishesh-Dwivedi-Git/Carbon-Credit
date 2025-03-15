import CO2Consumption from '../models/co2Consumption.models.js';
import Org from '../models/org.models.js';
import dotenv from 'dotenv';
dotenv.config();
import { tokenContract } from "../utils/blockchain.js"; // Import token contract


export async function submitCO2Consumption(req, res, next) {
    try {
        const { 
            reportYear, 
            reportMonth, 
            totalEmissions, 
            emissionSources, 
            documentProof 
        } = req.body;
        const organization = req.user.id;

        const org = await Org.findById(organization);
        if (!org) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        // Update totalEmissions before creating new entry
        const existingConsumption = await CO2Consumption.findOne({
            organization,
            reportYear,
            reportMonth
        });

        if (existingConsumption) {
            existingConsumption.totalEmissions += totalEmissions;
            await existingConsumption.save();
        } else {
            const co2Consumption = new CO2Consumption({
                organization,
                reportYear,
                reportMonth,
                totalEmissions,
                emissionSources,
                documentProof
            });
            await co2Consumption.save();
        }

        // Calculate stars earned
        let starsEarned = calculateStars(existingConsumption || co2Consumption);
        org.org_stars += starsEarned;

        // Retrieve corresponding CCT tokens from the user
        const cctAmount = totalEmissions; // Example conversion logic (adjust as needed)

        try {
            const tx = await tokenContract.retrieveTokens(org.walletAddress, cctAmount); // Approval from frontend for owner's address is required
            await tx.wait();
            console.log(`Retrieved ${cctAmount} CCT from ${org.walletAddress}`);
            org.CCtTokens -= cctAmount; // Deduct retrieved CCT tokens from user's account
        } catch (err) {
            console.error("Token retrieval failed:", err);
            return res.status(500).json({ message: "Token retrieval failed", error: err.message });
        }

        await org.save();

        res.status(201).json({
            message: 'CO2 consumption data submitted successfully',
            existingConsumption: existingConsumption || co2Consumption,
            starsEarned
        });
    } catch (error) {
        next(error);
    }
}


export async function verifyCO2Consumption(req, res, next) {
    try {
        const { id } = req.params;
        const { verificationStatus } = req.body;


        const co2Consumption = await CO2Consumption.findByIdAndUpdate(
            id, 
            { 
                verificationStatus,
                starsEarned: verificationStatus === 'VERIFIED' ? calculateStars(co2Consumption) : 0
            },
            { new: true }
        );

        if (!co2Consumption) {
            return res.status(404).json({ message: 'CO2 consumption record not found' });
        }

        res.status(200).json({
            message: 'CO2 consumption verification updated',
            co2Consumption
        });
    } catch (error) {
        next(error);
    }
}

// Helper function to calculate stars based on CO2 consumption data
function calculateStars(co2Consumption) {
    // Implement star calculation logic
    // Example: 
    // - Basic submission: 1 star
    // - Complete detailed submission: 3 stars
    // - Verified submission: Additional stars
    let stars = 0;

    if (co2Consumption.emissionSources && co2Consumption.emissionSources.length > 0) {
        stars += 3;
    }

    if (co2Consumption.verificationStatus === 'VERIFIED') {
        stars += 2;
    }

    return stars;
}

export async function getOrganizationCO2Reports(req, res, next) {
    try {
        const organization = req.user.id;

        const co2Reports = await CO2Consumption.find({ organization })
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: 'CO2 consumption reports retrieved',
            co2Reports
        });
    } catch (error) {
        next(error);
    }
}