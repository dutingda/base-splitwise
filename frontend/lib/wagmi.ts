import { createConfig, http } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ''

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected(),
    coinbaseWallet({
      appName: 'Base Splitwise',
    }),
    walletConnect({
      projectId,
    }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
})