'use client'

import { useState } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACTS } from '@/lib/contracts'
import { baseSepolia } from 'wagmi/chains'
import AddExpense from './AddExpense'
import ExpenseList from './ExpenseList'
import MemberList from './MemberList'
import SettlementView from './SettlementView'

interface GroupDetailsProps {
  groupId: number
}

export default function GroupDetails({ groupId }: GroupDetailsProps) {
  const [activeTab, setActiveTab] = useState<'expenses' | 'members' | 'settle'>('expenses')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { address } = useAccount()
  const { writeContract, data: deleteHash } = useWriteContract()
  const { isLoading: isDeleting } = useWaitForTransactionReceipt({ hash: deleteHash })

  const { data: group } = useReadContract({
    address: CONTRACTS.BaseSplitwise.address[baseSepolia.id] as `0x${string}`,
    abi: CONTRACTS.BaseSplitwise.abi,
    functionName: 'groups',
    args: [BigInt(groupId)],
  })

  const { data: balance = BigInt(0) } = useReadContract({
    address: CONTRACTS.BaseSplitwise.address[baseSepolia.id] as `0x${string}`,
    abi: CONTRACTS.BaseSplitwise.abi,
    functionName: 'getGroupBalance',
    args: [BigInt(groupId), address!],
    query: {
      enabled: !!address,
    },
  })

  if (!group) return null

  const formatBalance = (bal: bigint) => {
    const value = Number(bal) / 1e18
    if (value > 0) return `+${value.toFixed(4)} ETH`
    if (value < 0) return `${value.toFixed(4)} ETH`
    return '0 ETH'
  }

  const handleDelete = () => {
    writeContract({
      address: CONTRACTS.BaseSplitwise.address[baseSepolia.id] as `0x${string}`,
      abi: CONTRACTS.BaseSplitwise.abi,
      functionName: 'deleteGroup',
      args: [BigInt(groupId)],
    })
  }

  const { data: members = [] } = useReadContract({
    address: CONTRACTS.BaseSplitwise.address[baseSepolia.id] as `0x${string}`,
    abi: CONTRACTS.BaseSplitwise.abi,
    functionName: 'getGroupMembers',
    args: [BigInt(groupId)],
  })

  const { data: settlements = [] } = useReadContract({
    address: CONTRACTS.BaseSplitwise.address[baseSepolia.id] as `0x${string}`,
    abi: CONTRACTS.BaseSplitwise.abi,
    functionName: 'calculateSettlements',
    args: [BigInt(groupId)],
  })

  const isCreator = group && group[2] === address
  const hasUnsettledBalances = settlements.length > 0
  const canDelete = isCreator && !hasUnsettledBalances

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{group[1]}</h2>
            <p className="text-gray-500">Group #{groupId}</p>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Your Balance</p>
              <p className={`text-2xl font-semibold ${
                balance > BigInt(0) ? 'text-green-600' : balance < BigInt(0) ? 'text-red-600' : 'text-gray-900'
              }`}>
                {formatBalance(balance)}
              </p>
            </div>
          </div>
          
          {isCreator && (
            <div>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Delete Group
                </button>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-w-xs">
                  <p className="text-sm text-red-800 font-medium mb-2">Delete this group?</p>
                  {!canDelete && (
                    <p className="text-xs text-red-600 mb-2">
                      All balances must be settled first
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={handleDelete}
                      disabled={!canDelete || isDeleting}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:bg-gray-400"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-3 py-1 border border-gray-300 text-sm rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex-1 py-3 px-4 text-center font-medium transition ${
              activeTab === 'expenses'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`flex-1 py-3 px-4 text-center font-medium transition ${
              activeTab === 'members'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Members
          </button>
          <button
            onClick={() => setActiveTab('settle')}
            className={`flex-1 py-3 px-4 text-center font-medium transition ${
              activeTab === 'settle'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Settle Up
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'expenses' && (
          <>
            <AddExpense groupId={groupId} />
            <ExpenseList groupId={groupId} />
          </>
        )}
        {activeTab === 'members' && <MemberList groupId={groupId} />}
        {activeTab === 'settle' && <SettlementView groupId={groupId} />}
      </div>
    </div>
  )
}