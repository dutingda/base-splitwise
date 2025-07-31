// Contract deployed to Base Sepolia
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0xd33b2e31Bd8A0d0957FBF02C01163461883eEc33'

export const CONTRACTS = {
  BaseSplitwise: {
    address: {
      // Will be updated after deployment
      84532: CONTRACT_ADDRESS as `0x${string}`, // Base Sepolia
      8453: '0x0000000000000000000000000000000000000000', // Base Mainnet
    },
    abi: [
      {
        "type": "function",
        "name": "createGroup",
        "inputs": [{"name": "name", "type": "string"}],
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "addMember",
        "inputs": [
          {"name": "groupId", "type": "uint256"},
          {"name": "member", "type": "address"}
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "addExpense",
        "inputs": [
          {"name": "groupId", "type": "uint256"},
          {"name": "amount", "type": "uint256"},
          {"name": "description", "type": "string"},
          {"name": "participants", "type": "address[]"}
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "calculateSettlements",
        "inputs": [{"name": "groupId", "type": "uint256"}],
        "outputs": [
          {
            "name": "",
            "type": "tuple[]",
            "components": [
              {"name": "from", "type": "address"},
              {"name": "to", "type": "address"},
              {"name": "amount", "type": "uint256"}
            ]
          }
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "recordPayment",
        "inputs": [
          {"name": "groupId", "type": "uint256"},
          {"name": "to", "type": "address"},
          {"name": "amount", "type": "uint256"}
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
      },
      {
        "type": "function",
        "name": "getGroupBalance",
        "inputs": [
          {"name": "groupId", "type": "uint256"},
          {"name": "member", "type": "address"}
        ],
        "outputs": [{"name": "", "type": "int256"}],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "getGroupMembers",
        "inputs": [{"name": "groupId", "type": "uint256"}],
        "outputs": [{"name": "", "type": "address[]"}],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "getGroupExpenses",
        "inputs": [{"name": "groupId", "type": "uint256"}],
        "outputs": [{"name": "", "type": "uint256[]"}],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "getUserGroups",
        "inputs": [{"name": "user", "type": "address"}],
        "outputs": [{"name": "", "type": "uint256[]"}],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "groups",
        "inputs": [{"name": "", "type": "uint256"}],
        "outputs": [
          {"name": "id", "type": "uint256"},
          {"name": "name", "type": "string"},
          {"name": "creator", "type": "address"},
          {"name": "isActive", "type": "bool"}
        ],
        "stateMutability": "view"
      },
      {
        "type": "function",
        "name": "expenses",
        "inputs": [{"name": "", "type": "uint256"}],
        "outputs": [
          {"name": "id", "type": "uint256"},
          {"name": "payer", "type": "address"},
          {"name": "amount", "type": "uint256"},
          {"name": "description", "type": "string"},
          {"name": "timestamp", "type": "uint256"},
          {"name": "isSettled", "type": "bool"}
        ],
        "stateMutability": "view"
      },
      {
        "type": "event",
        "name": "GroupCreated",
        "inputs": [
          {"name": "groupId", "type": "uint256", "indexed": true},
          {"name": "name", "type": "string", "indexed": false},
          {"name": "creator", "type": "address", "indexed": true}
        ]
      },
      {
        "type": "event",
        "name": "MemberAdded",
        "inputs": [
          {"name": "groupId", "type": "uint256", "indexed": true},
          {"name": "member", "type": "address", "indexed": true}
        ]
      },
      {
        "type": "event",
        "name": "ExpenseAdded",
        "inputs": [
          {"name": "groupId", "type": "uint256", "indexed": true},
          {"name": "expenseId", "type": "uint256", "indexed": true},
          {"name": "payer", "type": "address", "indexed": true},
          {"name": "amount", "type": "uint256", "indexed": false}
        ]
      },
      {
        "type": "event",
        "name": "PaymentMade",
        "inputs": [
          {"name": "groupId", "type": "uint256", "indexed": true},
          {"name": "from", "type": "address", "indexed": true},
          {"name": "to", "type": "address", "indexed": true},
          {"name": "amount", "type": "uint256", "indexed": false}
        ]
      },
      {
        "type": "function",
        "name": "deleteGroup",
        "inputs": [{"name": "groupId", "type": "uint256"}],
        "outputs": [],
        "stateMutability": "nonpayable"
      },
      {
        "type": "event",
        "name": "GroupDeleted",
        "inputs": [
          {"name": "groupId", "type": "uint256", "indexed": true},
          {"name": "deletedBy", "type": "address", "indexed": true}
        ]
      }
    ]
  }
} as const