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

  const coinbaseConnector = connectors.find(c => c.name === 'Coinbase Wallet')

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">📱 Connect with Coinbase Wallet</h3>
        <p className="text-sm text-blue-700 mb-3">
          For Base Sepolia testnet:
        </p>
        <ol className="text-sm text-blue-700 space-y-2">
          <li>1. Open <strong>Coinbase Wallet</strong> app</li>
          <li>2. Tap the browser icon (center bottom)</li>
          <li>3. Navigate to this URL</li>
          <li>4. Switch to <strong>Base Sepolia</strong> network</li>
        </ol>
      </div>

      {coinbaseConnector && (
        <button
          onClick={() => handleConnect(coinbaseConnector)}
          disabled={isConnecting}
          className="w-full p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
        >
          {isConnecting ? 'Connecting...' : 'Connect with Coinbase Wallet'}
        </button>
      )}
    </div>
  )
}