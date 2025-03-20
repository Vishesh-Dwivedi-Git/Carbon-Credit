import { create } from 'zustand';
import axios from 'axios';
import { parseEther, parseUnits } from 'viem';


// Axios Configuration
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && !config.url.includes('/register')) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Contract Addresses
const CCT_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_CCT;
const TRADING_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TRADING;
const OWNER_ADDRESS = process.env.NEXT_PUBLIC_OWNER;

// ----------------- AUTHORIZE STORE -----------------
const useAuthorizeStore = create((set) => ({
    userAddress: null,
    authorizeUser: async (walletAddress) => {
        if (!walletAddress) {
            console.error("Invalid wallet address:", walletAddress);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/auth/authorizeUser', { walletAddress });
            console.log('Authorization successful:', response.data);
            set({ userAddress: walletAddress });
        } catch (error) {
            console.error('Authorization failed:', error);
        }
    }
}));


// ----------------- CREATE ORDER STORE -----------------
const useCreateOrder = create((set) => {
    // const { writeContractAsync } = useWriteContract(); 
    return {
        isLoading: false,

        executeTrade: async ({ requestType, carbonTokenAmount, pricePerToken }) => {
            try {
                set({ isLoading: true });

                if (requestType === 'SELL') {
                    const approveTx = await writeContractAsync({
                        address: CCT_TOKEN_ADDRESS,
                        abi: ['function approve(address spender, uint256 amount) public returns (bool)'],
                        functionName: 'approve',
                        args: [TRADING_CONTRACT_ADDRESS, parseUnits(carbonTokenAmount.toString(), 18)]
                    });

                    const approveReceipt = await approveTx.wait();
                    if (!approveReceipt || approveReceipt.status !== 1) {
                        throw new Error('Approval transaction failed.');
                    }
                }

              const response=await axios.post('/trade-request', { requestType, carbonTokenAmount, pricePerToken });
              console.log("Successfully created trade request:", response.data);
            } catch (error) {
                console.error('Execution failed:', error);
            } finally {
                set({ isLoading: false });
            }
        }
    };
});

// ----------------- TRANSFER ON REGISTER STORE -----------------
const useTransferOnRegisterStore = create((set) => ({
    registerUser: async (data) => {
        try {
            const response = await axios.post('/register', data);
            console.log('User registered successfully:', response.data);
        } catch (error) {
            console.error('Registration failed:', error);
        }
    }
}));

// ----------------- TRADE REQUEST STORE -----------------
const useTradeRequestStore = create((set) => ({
    tradeRequests: [],
    fetchTradeRequests: async () => {
        try {
            console.log("Fetching trade requests..."); // 🔍 Debugging Line
            const response = await axios.get('http://localhost:5000/api/carbon/trade-requests');
            console.log("API Response:", response.data); // 🔍 Debugging Line
    
            const indexedTradeRequests = response.data.map((request, index) => ({ ...request, index }));
            set({ tradeRequests: indexedTradeRequests });
        } catch (error) {
            console.error('Failed to fetch trade requests:', error);
        }
    }
    
}));

// ----------------- EXECUTE TRADE STORE -----------------

 // Import wagmi public client

const useExecuteTradeStore = create((set) => ({
    isLoading: false,

    executeTrade: async ({
        sellerId,
        sellerAddress,
        pricePerToken,
        carbonTokenAmount,
        sendTransactionAsync,
        publicClient
    }) => {
        console.log(pricePerToken, carbonTokenAmount, sellerAddress, sellerId); // Debugging

        const totalEthToSend = (parseFloat(pricePerToken) * parseFloat(carbonTokenAmount)).toString();

        if (isNaN(Number(totalEthToSend)) || Number(totalEthToSend) <= 0) {
            throw new Error("Invalid transaction amount. Please check the values.");
        }

        try {
            set({ isLoading: true });

            // ✅ Get the public client inside the function 
            if (!publicClient) throw new Error("publicClient is undefined");

            // Send transaction and get the transaction hash
            const txHash = await sendTransactionAsync({
                to: sellerAddress,
                value: parseEther(totalEthToSend),
            });

            console.log("Transaction sent! Hash:", txHash);

            // Wait for transaction receipt
            const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

            if (!receipt || receipt.status !== 'success') {
                throw new Error('Transaction failed.');
            }

            console.log("Transaction confirmed!", receipt);

            // Notify backend after successful transaction
            console.log(sellerId);
            const response=await axios.post("http://localhost:5000/api/carbon/match-trade", { sellerId });
            console.log("Successfully matched trade request:", response.data);
            

        } catch (error) {
            console.error('Execution failed:', error);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    }
}));



// ----------------- CO2 CONSUMPTION REPORT STORE -----------------
const useCO2ReportStore = create((set) => ({
    isLoading: false,

    submitCO2Report: async ({ reportYear, reportMonth, totalEmissions, emissionSources, documentProof }) => {
        try {
            set({ isLoading: true });

            const { writeAsync: approveAsync } = useContractWrite({
                address: CCT_TOKEN_ADDRESS,
                abi: ['function approve(address spender, uint256 amount) public returns (bool)'],
                functionName: 'approve'
            });

            const approveTx = await approveAsync({
                args: [OWNER_ADDRESS, parseUnits(totalEmissions.toString(), 18)]
            });
            const approveReceipt = await approveTx.wait();
            if (!approveReceipt || approveReceipt.status !== 1) throw new Error('Approval failed.');

            await axios.post('/submit-co2', { reportYear, reportMonth, totalEmissions, emissionSources, documentProof });
        } catch (error) {
            console.error('Submission failed:', error);
        } finally {
            set({ isLoading: false });
        }
    }
}));

export {
    useTransferOnRegisterStore,
    useAuthorizeStore,
    useTradeRequestStore,
    useExecuteTradeStore,
    useCreateOrder,
    useCO2ReportStore
};
