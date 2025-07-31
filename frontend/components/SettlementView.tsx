'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { CONTRACTS } from '@/lib/contracts'
import { baseSepolia } from 'wagmi/chains'
import { formatEther } from 'viem'
import BasePaymentButton from './BasePaymentButton'

interface SettlementViewProps {
  groupId: number
}

export default function SettlementView({ groupId }: SettlementViewProps) {
  const { address } = useAccount()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  const { data: settlements = [] } = useReadContract({
    address: CONTRACTS.BaseSplitwise.address[baseSepolia.id] as `0x${string}`,
    abi: CONTRACTS.BaseSplitwise.abi,
    functionName: 'calculateSettlements',
    args: [BigInt(groupId)],
  })

  const { data: group } = useReadContract({
    address: CONTRACTS.BaseSplitwise.address[baseSepolia.id] as `0x${string}`,
    abi: CONTRACTS.BaseSplitwise.abi,
    functionName: 'groups',
    args: [BigInt(groupId)],
  })

  const handlePayment = (to: string, amount: bigint) => {
    writeContract({
      address: CONTRACTS.BaseSplitwise.address[baseSepolia.id] as `0x${string}`,
      abi: CONTRACTS.BaseSplitwise.abi,
      functionName: 'recordPayment',
      args: [BigInt(groupId), to as `0x${string}`, amount],
    })
  }

  const userSettlements = settlements.filter(
    (s) => s.from === address || s.to === address
  )

  if (userSettlements.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-2">All settled up!</p>
        <p className="text-sm text-gray-400">No payments needed</p>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Settlement Suggestions</h3>
      <div className="space-y-3">
        {userSettlements.map((settlement, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">
                  {settlement.from === address ? 'You owe' : 'You are owed by'}
                </p>
                <p className="text-sm text-gray-500">
                  {settlement.from === address
                    ? `${settlement.to.slice(0, 6)}...${settlement.to.slice(-4)}`
                    : `${settlement.from.slice(0, 6)}...${settlement.from.slice(-4)}`}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">
                  {formatEther(settlement.amount)} ETH
                </p>
                <div className="flex flex-col gap-2 mt-2">
                  {settlement.from === address ? (
                    // User owes money - show send button
                    <>
                      <BasePaymentButton
                        type="send"
                        recipientAddress={settlement.to}
                        amount={settlement.amount}
                        description={`Splitwise payment for ${group?.[1] || 'group'}`}
                      />
                      <button
                        onClick={() => handlePayment(settlement.to, settlement.amount)}
                        disabled={isPending || isConfirming}
                        className="px-4 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition disabled:bg-gray-400"
                      >
                        {isPending ? 'Signing...' : isConfirming ? 'Recording...' : 'Mark as Paid'}
                      </button>
                    </>
                  ) : (
                    // User is owed money - show request button
                    <BasePaymentButton
                      type="request"
                      recipientAddress={settlement.from}
                      amount={settlement.amount}
                      description={`Splitwise payment for ${group?.[1] || 'group'}`}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 space-y-3">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Base App Integration:</strong> Use the payment buttons to request or send money directly through the Base app.
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Manual Payment:</strong> After sending payment via Base or another method, click "Mark as Paid" to update the group balance.
          </p>
        </div>
      </div>
    </div>
  )
}