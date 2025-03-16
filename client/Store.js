import { create } from 'zustand';
import axios from 'axios';
import { useSendTransaction } from 'wagmi';
import { useContractWrite } from 'wagmi';
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
const useCreateOrder = create((set) => ({
    isLoading: false,

    executeTrade: async ({ sellerId, requestType, carbonTokenAmount, pricePerToken }) => {
        try {
            set({ isLoading: true });

            if (requestType === 'SELL') {
                const { writeAsync: approveAsync } = useContractWrite({
                    address: CCT_TOKEN_ADDRESS,
                    abi: ['function approve(address spender, uint256 amount) public returns (bool)'],
                    functionName: 'approve'
                });

                const approveTx = await approveAsync({
                    args: [TRADING_CONTRACT_ADDRESS, parseUnits(carbonTokenAmount.toString(), 18)]
                });
                const approveReceipt = await approveTx.wait();
                if (!approveReceipt || approveReceipt.status !== 1) throw new Error('Approval transaction failed.');
            }

            await axios.post('/trade-request', { sellerId, requestType, carbonTokenAmount, pricePerToken });
        } catch (error) {
            console.error('Execution failed:', error);
        } finally {
            set({ isLoading: false });
        }
    }
}));

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
            const response = await axios.get('/trade-requests');
            const indexedTradeRequests = response.data.map((request, index) => ({ ...request, index }));
            set({ tradeRequests: indexedTradeRequests });
        } catch (error) {
            console.error('Failed to fetch trade requests:', error);
        }
    }
}));

// ----------------- EXECUTE TRADE STORE -----------------
const useExecuteTradeStore = create((set) => ({
    isLoading: false,

    executeTrade: async ({ sellerId, sellerAddress, pricePerToken, carbonTokenAmount }) => {
        const totalEthToSend = (pricePerToken * carbonTokenAmount).toString();

        try {
            set({ isLoading: true });
            const { sendTransactionAsync } = useSendTransaction();
            const tx = await sendTransactionAsync({
                to: sellerAddress,
                value: parseEther(totalEthToSend)
            });

            const receipt = await tx.wait();
            if (!receipt || receipt.status !== 1) throw new Error('Transaction failed.');

            await axios.post(`/match-trade/${sellerId}`, { sellerId });
        } catch (error) {
            console.error('Execution failed:', error);
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
