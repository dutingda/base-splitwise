# Base Splitwise

A decentralized expense splitting application built on Base, designed as a Mini App for the Base ecosystem.

## Features

- 🤝 Create expense groups with friends
- 💸 Track shared expenses
- ⚖️ Automatic balance calculation
- 🔄 Optimal settlement suggestions
- 📱 Base Mini App integration

## Smart Contract

The `BaseSplitwise` contract provides:

- Group creation and member management
- Expense tracking with multiple participants
- Automatic balance calculation
- Optimal settlement algorithm
- Payment recording

### Key Functions

- `createGroup(string name)` - Create a new expense group
- `addMember(uint256 groupId, address member)` - Add members to group
- `addExpense(uint256 groupId, uint256 amount, string description, address[] participants)` - Record an expense
- `calculateSettlements(uint256 groupId)` - Get optimal payment suggestions
- `recordPayment(uint256 groupId, address to, uint256 amount)` - Record a payment

## Development

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Node.js 18+

### Smart Contract Development

```bash
# Install dependencies
forge install

# Run tests
forge test

# Deploy to Base Sepolia
forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast --verify
```

### Frontend Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Deployment

### Smart Contract Deployment

1. Set up environment variables:
```bash
export PRIVATE_KEY=your_private_key
export BASESCAN_API_KEY=your_basescan_api_key
```

2. Deploy to Base Sepolia:
```bash
forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast --verify
```

### Mini App Deployment

The frontend is designed to work as a Base Mini App. Follow the [Base Mini App documentation](https://docs.base.org/mini-apps) for deployment instructions.

## License

MIT
