'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { CONTRACTS } from '@/lib/contracts'
import { baseSepolia } from 'wagmi/chains'
import { parseEther } from 'viem'

interface AddExpenseProps {
  groupId: number
}

export default function AddExpense({ groupId }: AddExpenseProps) {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  const { data: members = [] } = useReadContract({
    address: CONTRACTS.BaseSplitwise.address[baseSepolia.id] as `0x${string}`,
    abi: CONTRACTS.BaseSplitwise.abi,
    functionName: 'getGroupMembers',
    args: [BigInt(groupId)],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !description || selectedMembers.length === 0) return

    writeContract({
      address: CONTRACTS.BaseSplitwise.address[baseSepolia.id] as `0x${string}`,
      abi: CONTRACTS.BaseSplitwise.abi,
      functionName: 'addExpense',
      args: [
        BigInt(groupId),
        parseEther(amount),
        description,
        selectedMembers as `0x${string}`[],
      ],
    })
  }

  const toggleMember = (member: string) => {
    setSelectedMembers(prev =>
      prev.includes(member)
        ? prev.filter(m => m !== member)
        : [...prev, member]
    )
  }

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Add Expense</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (ETH)
            </label>
            <input
              type="number"
              step="0.0001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Dinner, groceries, etc."
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Split between
          </label>
          <div className="space-y-2">
            {members.map((member) => (
              <label
                key={member}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedMembers.includes(member)}
                  onChange={() => toggleMember(member)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">{member}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending || isConfirming || !amount || !description || selectedMembers.length === 0}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {isPending ? 'Signing...' : isConfirming ? 'Adding...' : 'Add Expense'}
        </button>
      </form>
    </div>
  )
}