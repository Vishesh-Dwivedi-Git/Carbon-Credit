import { mintTokens } from '../services/mint.services.js';

// Minting Controller
export const mintToken = async function (req, res) {
    const { amount } = req.body;  // Extract amount from request body

    try {
        // Call the service to mint tokens
        const result = await mintTokens(amount);

        // Send success response
        return res.status(200).json({
            message: 'Tokens minted successfully',
            transactionHash: result.transactionHash,
        });
    } catch (error) {
        console.error('Minting error:', error);
        return res.status(500).json({
            message: 'Error minting tokens',
            error: error.message,
        });
    }
}
