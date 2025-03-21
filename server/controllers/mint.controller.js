import { tokenContract } from "../utils/blockchain.js"; // Import token contract

// Controller function to mint tokens
export const mintToken = async function (req, res) {
    const { amount } = req.body; // Extract amount from request body

    try {
        // Call the mint function directly on the token contract
        const result = await tokenContract.mint(amount);

        // Wait for transaction confirmation
        const receipt = await result.wait();

        if (receipt.status !== 'success') {
            throw new Error('Minting transaction failed');
        }

        // Send success response
        return res.status(200).json({
            message: 'Tokens minted successfully',
            transactionHash: receipt.transactionHash,
        });

    } catch (error) {
        console.error('Minting error:', error);
        return res.status(500).json({
            message: 'Error minting tokens',
            error: error.message,
        });
    }
}
