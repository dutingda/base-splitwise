'use client'

import { useState } from 'react'
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACTS } from '@/lib/contracts'
import { baseSepolia } from 'wagmi/chains'
import { isAddress } from 'viem'

interface MemberListProps {
  groupId: number
}

export default function MemberList({ groupId }: MemberListProps) {
  const [newMember, setNewMember] = useState('')
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  const { data: members = [] } = useReadContract({
    address: CONTRACTS.BaseSplitwise.address[baseSepolia.id] as `0x${string}`,
    abi: CONTRACTS.BaseSplitwise.abi,
    functionName: 'getGroupMembers',
    args: [BigInt(groupId)],
  })

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAddress(newMember)) {
      alert('Invalid Ethereum address')
      return
    }

    writeContract({
      address: CONTRACTS.BaseSplitwise.address[baseSepolia.id] as `0x${string}`,
      abi: CONTRACTS.BaseSplitwise.abi,
      functionName: 'addMember',
      args: [BigInt(groupId), newMember as `0x${string}`],
    })
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Group Members</h3>
      
      <form onSubmit={handleAddMember} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            placeholder="0x... (member address)"
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isPending || isConfirming || !newMember}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            Add
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {members.map((member, index) => (
          <MemberItem key={member} member={member} groupId={groupId} isCreator={index === 0} />
        ))}
      </div>
    </div>
  )
}

function MemberItem({ 
  member, 
  groupId, 
  isCreator 
}: { 
  member: string
  groupId: number
  isCreator: boolean 
}) {
  const { data: balance = 0n } = useReadContract({
    address: CONTRACTS.BaseSplitwise.address[baseSepolia.id] as `0x${string}`,
    abi: CONTRACTS.BaseSplitwise.abi,
    functionName: 'getGroupBalance',
    args: [BigInt(groupId), member as `0x${string}`],
  })

  const formatBalance = (bal: bigint) => {
    const value = Number(bal) / 1e18
    if (value > 0) return `+${value.toFixed(4)} ETH`
    if (value < 0) return `${value.toFixed(4)} ETH`
    return '0 ETH'
  }

  return (
    <div className="flex justify-between items-center p-3 border rounded-lg">
      <div>
        <p className="font-medium">
          {member.slice(0, 6)}...{member.slice(-4)}
        </p>
        {isCreator && <p className="text-xs text-gray-500">Group creator</p>}
      </div>
      <p className={`font-medium ${
        balance > 0n ? 'text-green-600' : balance < 0n ? 'text-red-600' : 'text-gray-900'
      }`}>
        {formatBalance(balance)}
      </p>
    </div>
  )
}