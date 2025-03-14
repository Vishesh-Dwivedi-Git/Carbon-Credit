import { tokenContract, tradingContract } from "../utils/blockchain.js";
import { ethers } from "ethers";

async function testContracts() {
    try {
        const balance = await tokenContract.balanceOf(wallet.address);
        console.log(`Balance: ${balance.toString()}`);
        const tx = await tradingContract.executeTrade(
        wallet.address,
        "0xAnotherAddress",
        ethers.parseUnits("10", 18),
        ethers.parseUnits("5", 18)
        );
        await tx.wait();
        console.log("Trade executed");
    } catch (error) {
        console.error("Error in testContracts:", error.message);
    }
    }

testContracts();