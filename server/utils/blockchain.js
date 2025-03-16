import { ethers } from "ethers";
import dotenv from "dotenv";
import abiTrading from "../ABI/abiTradingContract.json" assert { type: "json" };
import abiToken from "../ABI/abiCCT.json" assert { type: "json" };

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const tokenContract = new ethers.Contract(
    process.env.TOKEN_ADDRESS,
    abiToken,
    wallet
);

const tradingContract = new ethers.Contract(
    process.env.TRADING_ADDRESS,
    abiTrading,
    wallet
);

export { tokenContract, tradingContract };
