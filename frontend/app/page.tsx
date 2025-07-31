'use client'

import { useState } from 'react'
import { ConnectKitButton } from 'connectkit'
import { useAccount } from 'wagmi'
import GroupList from '@/components/GroupList'
import CreateGroup from '@/components/CreateGroup'
import GroupDetails from '@/components/GroupDetails'
import DeploymentCheck from '@/components/DeploymentCheck'

export default function Home() {
  const { isConnected } = useAccount()
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Base Splitwise</h1>
          <ConnectKitButton />
        </header>

        <DeploymentCheck />
        
        {!isConnected ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-4">Welcome to Base Splitwise</h2>
            <p className="text-gray-600 mb-8">Connect your wallet to start splitting expenses with friends</p>
            <ConnectKitButton.Custom>
              {({ show }) => (
                <button
                  onClick={show}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Connect Wallet
                </button>
              )}
            </ConnectKitButton.Custom>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <CreateGroup />
              <GroupList onSelectGroup={setSelectedGroupId} selectedGroupId={selectedGroupId} />
            </div>
            <div className="lg:col-span-2">
              {selectedGroupId ? (
                <GroupDetails groupId={selectedGroupId} />
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                  Select a group to view details
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
