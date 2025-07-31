'use client'

import { useConnect } from 'wagmi'
import { useState } from 'react'

export default function MobileConnect() {
  const { connectors, connect } = useConnect()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async (connector: any) => {
    try {
      setIsConnecting(true)
      await connect({ connector })
    } catch (error) {
      console.error('Connection error:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">📱 Mobile Connection Guide</h3>
        <p className="text-sm text-blue-700 mb-3">
          For best results, open this site in your wallet's browser:
        </p>
        <ol className="text-sm text-blue-700 space-y-2">
          <li>1. Open <strong>MetaMask</strong> or <strong>Coinbase Wallet</strong> app</li>
          <li>2. Find the browser icon (usually bottom menu)</li>
          <li>3. Navigate to this URL</li>
          <li>4. Make sure you're on <strong>Base Sepolia</strong> network</li>
        </ol>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Or try connecting here:</h3>
        
        {/* Standard connectors */}
        {connectors.map((connector) => (
          <button
            key={connector.id}
            onClick={() => handleConnect(connector)}
            disabled={isConnecting}
            className="w-full p-4 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Connect with {connector.name}
          </button>
        ))}
      </div>

      <div className="text-xs text-gray-500 text-center mt-4">
        <p>Note: Direct wallet links may open Base app on mainnet.</p>
        <p>Use wallet's built-in browser for testnet support.</p>
      </div>
    </div>
  )
}