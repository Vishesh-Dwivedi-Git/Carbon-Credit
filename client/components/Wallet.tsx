"use client"

import { useState, useEffect } from "react"
import { formatEther, parseEther } from "ethers"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  useWaitForTransactionReceipt,
} from "wagmi"

import { useAuthorizeStore } from "../Store"

export default function Wallet() {
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [isTransactionPending, setIsTransactionPending] = useState(false)
  const [isConnectorOpen, setIsConnectorOpen] = useState(false)

  const { address, isConnected } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balanceData } = useBalance({ address })
  const { sendTransaction, data: transactionData } = useSendTransaction()
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: transactionData,
  })

  const authorizeYourself = useAuthorizeStore((state) => state.authorizeUser)

  const handleTransfer = async () => {
    if (!recipient || !amount) {
      toast.error("Please provide both recipient address and amount.")
      return
    }

    try {
      setIsTransactionPending(true)
      toast.dismiss()
      toast.loading("Sending transaction...")

      sendTransaction({
        to: recipient as `0x${string}`,
        value: parseEther(amount),
      })
    } catch (error) {
      console.error("Transfer failed:", error)
      toast.dismiss()
      toast.error("Transfer failed.")
      setIsTransactionPending(false)
    }
  }

  useEffect(() => {
    if (isConfirmed && isTransactionPending) {
      toast.dismiss()
      toast.success(`Sent ${amount} ETH to ${recipient}`)
      setRecipient("")
      setAmount("")
      setIsTransactionPending(false)
    }
  }, [isConfirmed, isTransactionPending])

  const handleConnectorSelect = (connector: ReturnType<typeof useConnect>["connectors"][number]) => {
    connect({ connector })
    setIsConnectorOpen(false)
  }

  const handleAuthorize = () => {
    if (!address) {
      toast.error("Wallet not connected.")
      return
    }
    authorizeYourself(address)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Wallet</h1>

      {isConnected ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Connected Account: {address}</p>
          <p className="text-lg font-semibold">
            Balance: {balanceData ? formatEther(balanceData?.value) : "0"} {balanceData?.symbol}
          </p>

          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (ETH)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <Button disabled={isTransactionPending} onClick={handleTransfer}>
              {isTransactionPending ? "Sending..." : "Send ETH"}
            </Button>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleAuthorize} variant="outline">Authorize Yourself</Button>
            <Button onClick={() => {
              disconnect()
              toast.success("Disconnected from wallet")
            }} variant="outline">
              Disconnect
            </Button>
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
