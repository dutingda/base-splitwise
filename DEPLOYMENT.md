# Deployment Guide for Base Splitwise

## Prerequisites
- Node.js 18+
- A funded wallet on Base Sepolia (get test ETH from [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet))
- Basescan API key (get from [Basescan](https://basescan.org/myapikey))

## Step 1: Deploy Smart Contract

1. Create `.env` file in root directory:
```bash
cp .env.example .env
```

2. Add your private key (without 0x prefix) and Basescan API key to `.env`

3. Deploy to Base Sepolia:
```bash
forge script script/Deploy.s.sol:DeployScript --rpc-url base_sepolia --broadcast --verify -vvvv
```

4. Save the deployed contract address from the output

## Step 2: Update Frontend Configuration

1. Update the contract address in `frontend/lib/contracts.ts`:
```typescript
address: {
  84532: 'YOUR_DEPLOYED_CONTRACT_ADDRESS', // Base Sepolia
  8453: '0x0000000000000000000000000000000000000000', // Base Mainnet
},
```

2. Create `frontend/.env.local`:
```bash
cd frontend
cp .env.local.example .env.local
```

3. (Optional) Add WalletConnect Project ID to `.env.local`

## Step 3: Deploy to Vercel

### Option A: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
cd frontend
vercel
```

3. Follow the prompts:
   - Set up and deploy: Yes
   - Which scope: Your account
   - Link to existing project: No
   - Project name: base-splitwise
   - Directory: ./
   - Override settings: No

### Option B: Using GitHub Integration

1. Push your code to GitHub:
```bash
git add .
git commit -m "feat: add deployment configuration"
git push
```

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: Next.js
   - Root Directory: frontend
   - Build Command: npm run build
   - Install Command: npm install --legacy-peer-deps
6. Add environment variables if needed
7. Click "Deploy"

## Step 4: Test Your App

1. Visit your Vercel URL
2. Connect wallet (use Base Sepolia network)
3. Create a group
4. Add members
5. Add expenses
6. Check settlements

## Troubleshooting

### Contract not deploying
- Ensure you have test ETH on Base Sepolia
- Check your private key format (no 0x prefix)
- Verify RPC URL is correct

### Frontend build errors
- Use Node.js 18 or higher
- Run `npm install --legacy-peer-deps`
- Check contract address is correctly formatted

### Wallet connection issues
- Ensure you're on Base Sepolia network
- Add Base Sepolia to MetaMask:
  - Network Name: Base Sepolia
  - RPC URL: https://sepolia.base.org
  - Chain ID: 84532
  - Currency Symbol: ETH
  - Block Explorer: https://sepolia.basescan.org

## Demo Tips

- Have test ETH ready on multiple wallets
- Pre-create a group with some expenses
- Show the settlement flow
- Demonstrate the responsive design
- Explain the gas-optimized settlement algorithm