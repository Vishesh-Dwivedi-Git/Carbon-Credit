"use client"

import { useState } from "react"
import { formatEther, parseEther } from "ethers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import {
    useAccount,
    useConnect,
    useDisconnect,
    useBalance,
    useSendTransaction,
    useWaitForTransactionReceipt
    } from 'wagmi'

    export default function Wallet() {
    const { toast } = useToast()
    const [recipient, setRecipient] = useState<string>("")
    const [amount, setAmount] = useState<string>("")
    const [isTransactionPending, setIsTransactionPending] = useState(false)

    const { address, isConnected } = useAccount()
    const { connectors, connect } = useConnect()
    const { disconnect } = useDisconnect()
    const { data: balanceData } = useBalance({
        address: address,
    })
    const { sendTransaction, data: transactionData } = useSendTransaction()
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
            hash: transactionData,
        })

    // Handle ETH transfer
    const handleTransfer = async () => {
        if (!recipient || !amount) {
        toast({
            title: "Invalid Input",
            description: "Please provide a valid recipient and amount.",
            variant: "destructive",
        })
        return
        }

        try {
        setIsTransactionPending(true)
        sendTransaction({
            to: recipient as `0x${string}`,
            value: parseEther(amount),
        })
        } catch (error) {
        console.error("Transfer failed:", error)
        toast({
            title: "Transfer Failed",
            description: "Could not complete the transaction.",
            variant: "destructive",
        })
        setIsTransactionPending(false)
        }
    }

    // Watch for transaction confirmation
    if (isConfirmed && isTransactionPending) {
        toast({
        title: "Transfer Successful",
        description: `Sent ${amount} ETH to ${recipient}`,
        })
        setRecipient("")
        setAmount("")
        setIsTransactionPending(false)
    }

    return (
        <div className="space-y-6">
        <h1 className="text-3xl font-bold">Wallet</h1>

        {isConnected ? (
            <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Connected Account: {address}</p>
            <p className="text-lg font-semibold">Balance: {balanceData ? formatEther(balanceData?.value) : "0"} {balanceData?.symbol}</p>
            <div className="space-y-4">
                <div>
                <Label htmlFor="recipient">Recipient Address</Label>
                <Input
                    id="recipient"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="0x..."
                />
                </div>
                <div>
                <Label htmlFor="amount">Amount (ETH)</Label>
                <Input
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    type="number"
                    step="0.001"
                />
                </div>
                <Button 
                onClick={handleTransfer} 
                disabled={isTransactionPending || isConfirming}
                >
                {isTransactionPending || isConfirming ? "Sending..." : "Send ETH"}
                </Button>
                <Button onClick={() => disconnect()} variant="outline">Disconnect</Button>
            </div>
            </div>
        ) : (
            <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Connect your wallet to continue</p>
            <div className="flex flex-col gap-2">
                {connectors.map((connector) => (
                <Button 
                    key={connector.uid} 
                    onClick={() => connect({ connector })}
                >
                    Connect with {connector.name}
                </Button>
                ))}
            </div>
            </div>
        )}
        </div>
    )
}