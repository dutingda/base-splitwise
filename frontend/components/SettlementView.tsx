'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { CONTRACTS } from '@/lib/contracts'
import { baseSepolia } from 'wagmi/chains'
import { formatEther } from 'viem'

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
                {settlement.from === address && (
                  <button
                    onClick={() => handlePayment(settlement.to, settlement.amount)}
                    disabled={isPending || isConfirming}
                    className="mt-2 px-4 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition disabled:bg-gray-400"
                  >
                    {isPending ? 'Signing...' : isConfirming ? 'Recording...' : 'Mark as Paid'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This records the payment in the app. You still need to send the actual ETH through your wallet or payment app.
        </p>
      </div>
    </div>
  )
}