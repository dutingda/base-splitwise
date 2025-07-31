'use client'

import { useChainId } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { CONTRACTS } from '@/lib/contracts'

export default function DeploymentCheck() {
  const chainId = useChainId()
  const contractAddress = CONTRACTS.BaseSplitwise.address[chainId as keyof typeof CONTRACTS.BaseSplitwise.address]
  
  if (contractAddress === '0x0000000000000000000000000000000000000000') {
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
        {chainId !== baseSepolia.id && (
          <p className="text-sm text-yellow-700 mt-2">
            Also, please switch to Base Sepolia network.
          </p>
        )}
      </div>
    )
  }
  
  return null
}