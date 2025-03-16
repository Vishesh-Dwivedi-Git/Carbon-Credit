"use client"

import { useState } from "react"
import { formatEther, parseEther } from "ethers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    } from "@/components/ui/popover"
    import {
    useAccount,
    useConnect,
    useDisconnect,
    useBalance,
    useSendTransaction,
    useWaitForTransactionReceipt
    } from 'wagmi'
import { stat } from "fs"

import { useAuthorizeStore } from "../Store"

    export default function Wallet() {
    const { toast } = useToast()
    const [recipient, setRecipient] = useState<string>("")
    const [amount, setAmount] = useState<string>("")
    const [isTransactionPending, setIsTransactionPending] = useState(false)
    const [isConnectorOpen, setIsConnectorOpen] = useState(false)

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

    // Handle connector selection
    const handleConnectorSelect = (connector: ReturnType<typeof useConnect>['connectors'][number]) => {
        connect({ connector })
        setIsConnectorOpen(false)
    }

    const authorizeYourself = useAuthorizeStore((state) => state.authorizeUser)

    const handleAuthorize = () => {
        if (!address) {
            console.error("Wallet not connected");
            return;
        }
        authorizeYourself(address); // Pass only the wallet address
    };

    return (
        <div className="space-y-6">
        <h1 className="text-3xl font-bold">Wallet</h1>

        {isConnected ? (
            <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Connected Account: {address}</p>
            <p className="text-lg font-semibold">Balance: {balanceData ? formatEther(balanceData?.value) : "0"} {balanceData?.symbol}</p>
            <div className="flex gap-8">
            <Button onClick={handleAuthorize} variant="outline">Authorise Yourself</Button>
            <Button onClick={() => disconnect()} variant="outline">Disconnect</Button>
            </div>
            </div>
        ) : (
            <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Connect your wallet to continue</p>
            <Popover open={isConnectorOpen} onOpenChange={setIsConnectorOpen}>
                <PopoverTrigger asChild>
                <Button>Connect Wallet</Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                <div className="flex flex-col gap-2">
                    {connectors.map((connector) => (
                    <Button 
                        key={connector.uid} 
                        onClick={() => handleConnectorSelect(connector)}
                        variant="outline"
                        className="justify-start"
                    >
                        Connect with {connector.name}
                    </Button>
                    ))}
                </div>
                </PopoverContent>
            </Popover>
            </div>
        )}
        </div>
    )
    }