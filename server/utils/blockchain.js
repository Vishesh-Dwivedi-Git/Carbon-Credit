import fs from "fs";
import path from "path";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const tokenABI = JSON.parse(
    fs.readFileSync(
        path.resolve(__dirname, "../../smartContract/abiCCT.json"),
        "utf8"
    )
    );
    const tradingABI = JSON.parse(
    fs.readFileSync(
        path.resolve(__dirname, "../../smartContract/abiTradingContract.json"),
        "utf8"
    )
    );
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