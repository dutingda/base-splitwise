import { createConfig, http } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors'

const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID' // Add this to env

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected(),
    coinbaseWallet({
      appName: 'Base Splitwise',
    }),
    walletConnect({
      projectId: projectId || 'dummy',
      showQrModal: true,
      metadata: {
        name: 'Base Splitwise',
        description: 'Split expenses onchain',
        url: 'https://base-splitwise.vercel.app',
        icons: ['https://base-splitwise.vercel.app/icon.png']
      }
    }),
  ],
  transports: {
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },
  ssr: true,
})