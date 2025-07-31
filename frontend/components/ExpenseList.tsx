'use client'

import { useReadContract } from 'wagmi'
import { CONTRACTS } from '@/lib/contracts'
import { baseSepolia } from 'wagmi/chains'
import { formatEther } from 'viem'

interface ExpenseListProps {
  groupId: number
}

export default function ExpenseList({ groupId }: ExpenseListProps) {
  const { data: expenseIds = [] } = useReadContract({
    address: CONTRACTS.BaseSplitwise.address[baseSepolia.id] as `0x${string}`,
    abi: CONTRACTS.BaseSplitwise.abi,
    functionName: 'getGroupExpenses',
    args: [BigInt(groupId)],
  })

  if (expenseIds.length === 0) {
    return <p className="text-gray-500 text-center py-8">No expenses yet</p>
  }

  return (
    <div className="space-y-3">
      {expenseIds.map((expenseId) => (
        <ExpenseItem key={expenseId.toString()} expenseId={Number(expenseId)} />
      ))}
    </div>
  )
}

function ExpenseItem({ expenseId }: { expenseId: number }) {
  const { data: expense } = useReadContract({
    address: CONTRACTS.BaseSplitwise.address[baseSepolia.id] as `0x${string}`,
    abi: CONTRACTS.BaseSplitwise.abi,
    functionName: 'expenses',
    args: [BigInt(expenseId)],
  })

  if (!expense) return null

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString()
  }

  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50 transition">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{expense[3]}</h4>
          <p className="text-sm text-gray-500">
            Paid by {expense[1].slice(0, 6)}...{expense[1].slice(-4)}
          </p>
          <p className="text-xs text-gray-400">{formatDate(expense[4])}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">{formatEther(expense[2])} ETH</p>
        </div>
      </div>
    </div>
  )
}