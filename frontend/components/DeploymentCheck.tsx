'use client'

import { useChainId } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { CONTRACTS } from '@/lib/contracts'

export default function DeploymentCheck() {
  const chainId = useChainId()
  const contractAddress = CONTRACTS.BaseSplitwise.address[chainId as keyof typeof CONTRACTS.BaseSplitwise.address]
  
  // Show network switch message if not on Base Sepolia
  if (chainId !== baseSepolia.id) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-blue-800 mb-2">🔗 Switch to Base Sepolia Network</h3>
        <p className="text-sm text-blue-700 mb-2">
          Please switch to Base Sepolia network to use this app.
        </p>
        <div className="text-sm text-blue-700 space-y-1">
          <p><strong>Network Name:</strong> Base Sepolia</p>
          <p><strong>Chain ID:</strong> 84532</p>
          <p><strong>RPC URL:</strong> https://sepolia.base.org</p>
          <p><strong>Currency:</strong> ETH</p>
          <p><strong>Explorer:</strong> https://sepolia.basescan.org</p>
        </div>
        <p className="text-xs text-blue-600 mt-2">
          Current network: Chain ID {chainId}
        </p>
      </div>
    )
  }
  
  if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Smart Contract Not Deployed</h3>
        <p className="text-sm text-yellow-700 mb-2">
          The smart contract hasn't been deployed yet. To use this app:
        </p>
        <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
          <li>Deploy the contract using the instructions in DEPLOYMENT.md</li>
          <li>Update the contract address in frontend/lib/contracts.ts</li>
          <li>Redeploy the frontend</li>
        </ol>
      </div>
    )
  }
  
  // Show success message with contract info
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
      <h3 className="font-semibold text-green-800 mb-2">✅ Ready to Use!</h3>
      <p className="text-sm text-green-700">
        Contract deployed at: <code className="bg-green-100 px-1 rounded">{contractAddress}</code>
      </p>
      <p className="text-xs text-green-600 mt-1">
        <a 
          href={`https://sepolia.basescan.org/address/${contractAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-green-800"
        >
          View on Base Sepolia Explorer →
        </a>
      </p>
    </div>
  )
}