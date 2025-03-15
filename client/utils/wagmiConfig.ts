import { http, createConfig } from 'wagmi'
import { base, mainnet, optimism, sepolia } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect , coinbaseWallet} from 'wagmi/connectors'

export const config = createConfig({
    chains: [mainnet, base, sepolia],
    connectors: [
            injected(),
            metaMask(),
            safe(),
            coinbaseWallet({
                appName: 'CarbonChain Web3 App',
            }),
            ],
            transports: {
            [mainnet.id]: http(),
            [base.id]: http(),
            [sepolia.id]: http(),
            },
})