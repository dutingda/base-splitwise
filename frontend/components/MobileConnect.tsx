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
    <div className="space-y-3">
      <h3 className="text-lg font-semibold mb-2">Choose Wallet:</h3>
      
      {/* Direct links for mobile wallets */}
      <a
        href={`metamask://dapp/${window.location.host}`}
        className="block w-full p-4 border rounded-lg hover:bg-gray-50 text-center"
      >
        Open in MetaMask
      </a>
      
      <a
        href={`https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(window.location.href)}`}
        className="block w-full p-4 border rounded-lg hover:bg-gray-50 text-center"
      >
        Open in Coinbase Wallet
      </a>

      {/* Fallback connectors */}
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
  )
}