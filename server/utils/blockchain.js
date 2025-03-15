// This file is used to connect to the blockchain using ethers.js and the contract ABI's
// It exports the tokenContract and tradingContract which are used in the auth.controllers.js file

import { ethers } from "ethers";
import dotenv from "dotenv";
import abiTrading from "../ABI/abiTradingContract.json" assert { type: "json" };
import abiToken from "../ABI/abiCCT.json" assert { type: "json" };

dotenv.config();
 
    const tokenABI = abiToken;
    const tradingABI = abiTrading;
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);


    const tokenContract = new ethers.Contract(
    process.env.TOKEN_ADDRESS,
    tokenABI,
    wallet
    );
    const tradingContract = new ethers.Contract(
    process.env.TRADING_ADDRESS,
    tradingABI,
    wallet
);

export { tokenContract, tradingContract };