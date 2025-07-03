import { create } from 'zustand';
import axios from 'axios';
import { parseEther, parseUnits } from 'viem';
import toast from 'react-hot-toast';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && !config.url.includes('/register')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const CCT_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_CCT;
const TRADING_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TRADING;
const OWNER_ADDRESS = process.env.NEXT_PUBLIC_OWNER;

const useAuthorizeStore = create((set) => ({
  userAddress: null,
  authorizeUser: async (walletAddress) => {
    if (!walletAddress) {
      toast.error("Invalid wallet address");
      return;
    }
    try {
      const response = await axios.post('/auth/authorizeUser', { walletAddress });
      set({ userAddress: walletAddress });
      toast.success("Authorization successful");
    } catch (error) {
      console.error('Authorization failed:', error);
      toast.error(`Authorization failed: ${error?.response?.data?.message || error.message || "Unknown error"}`);
    }
  }
}));

const useCreateOrder = create((set) => ({
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
      const response = await axios.post('/trade-request', { requestType, carbonTokenAmount, pricePerToken });
      console.log("Successfully created trade request:", response.data);
      toast.success("Trade request created");
    } catch (error) {
      console.error('Execution failed:', error);
      toast.error(`Trade execution failed: ${error?.response?.data?.message || error.message || "Unknown error"}`);
    } finally {
      set({ isLoading: false });
    }
  }
}));

const useTransferOnRegisterStore = create((set) => ({
  registerUser: async (data) => {
    try {
      const response = await axios.post('/register', data);
      toast.success("User registered successfully");
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(`Registration failed: ${error?.response?.data?.message || error.message || "Unknown error"}`);
    }
  }
}));

const useTradeRequestStore = create((set) => ({
  tradeRequests: [],
  fetchTradeRequests: async () => {
    try {
      const response = await axios.get('/carbon/trade-requests');
      const indexedTradeRequests = response.data.map((request, index) => ({ ...request, index }));
      set({ tradeRequests: indexedTradeRequests });
    } catch (error) {
      console.error('Failed to fetch trade requests:', error);
      toast.error(`Failed to load trade requests: ${error?.response?.data?.message || error.message || "Unknown error"}`);
    }
  }
}));

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
    const totalEthToSend = (parseFloat(pricePerToken) * parseFloat(carbonTokenAmount)).toString();

    if (isNaN(Number(totalEthToSend)) || Number(totalEthToSend) <= 0) {
      toast.error("Invalid transaction amount");
      throw new Error("Invalid transaction amount");
    }

    try {
      set({ isLoading: true });
      toast.dismiss();
      toast.loading("Sending ETH...");

      if (!publicClient) throw new Error("publicClient is undefined");

      const txHash = await sendTransactionAsync({
        to: sellerAddress,
        value: parseEther(totalEthToSend),
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

      if (!receipt || receipt.status !== 'success') {
        throw new Error('Transaction failed');
      }

      await axios.post("/carbon/match-trade", { sellerId });
      toast.dismiss();
      toast.success("Trade executed successfully");
    } catch (error) {
      console.error('Execution failed:', error);
      toast.dismiss();
      toast.error(`Trade execution failed: ${error?.response?.data?.message || error.message || "Unknown error"}`);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));

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
      if (!approveReceipt || approveReceipt.status !== 1) throw new Error('Approval failed');

      await axios.post('/submit-co2', { reportYear, reportMonth, totalEmissions, emissionSources, documentProof });
      toast.success("CO2 report submitted");
    } catch (error) {
      console.error('Submission failed:', error);
      toast.error(`Failed to submit CO2 report: ${error?.response?.data?.message || error.message || "Unknown error"}`);
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