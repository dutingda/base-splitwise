'use client'

import { useAccount, useReadContract } from 'wagmi'
import { CONTRACTS } from '@/lib/contracts'
import { baseSepolia } from 'wagmi/chains'

interface GroupListProps {
  onSelectGroup: (groupId: number) => void
  selectedGroupId: number | null
}

export default function GroupList({ onSelectGroup, selectedGroupId }: GroupListProps) {
  const { address } = useAccount()
  
  const { data: userGroups = [] } = useReadContract({
    address: CONTRACTS.BaseSplitwise.address[baseSepolia.id] as `0x${string}`,
    abi: CONTRACTS.BaseSplitwise.abi,
    functionName: 'getUserGroups',
    args: [address!],
    query: {
      enabled: !!address,
    },
  })

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Your Groups</h2>
      {userGroups.length === 0 ? (
        <p className="text-gray-500">No groups yet. Create one to get started!</p>
      ) : (
        <div className="space-y-2">
          {userGroups.map((groupId) => (
            <GroupItem
              key={groupId.toString()}
              groupId={Number(groupId)}
              isSelected={selectedGroupId === Number(groupId)}
              onSelect={onSelectGroup}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function GroupItem({ 
  groupId, 
  isSelected, 
  onSelect 
}: { 
  groupId: number
  isSelected: boolean
  onSelect: (id: number) => void 
}) {
  const { data: group } = useReadContract({
    address: CONTRACTS.BaseSplitwise.address[baseSepolia.id] as `0x${string}`,
    abi: CONTRACTS.BaseSplitwise.abi,
    functionName: 'groups',
    args: [BigInt(groupId)],
  })

  if (!group) return null

  return (
    <button
      onClick={() => onSelect(groupId)}
      className={`w-full text-left p-3 rounded-lg transition ${
        isSelected 
          ? 'bg-blue-100 border-2 border-blue-500' 
          : 'hover:bg-gray-100 border-2 border-transparent'
      }`}
    >
      <h3 className="font-medium">{group[1]}</h3>
      <p className="text-sm text-gray-500">Group #{groupId}</p>
    </button>
  )
}