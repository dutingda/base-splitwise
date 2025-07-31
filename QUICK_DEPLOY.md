# Quick Deploy Guide - Base Splitwise

## Prerequisites Checklist

- [ ] MetaMask or another wallet installed
- [ ] Test ETH on Base Sepolia (get from faucet below)
- [ ] Node.js 18+ installed

## Step 1: Get Test ETH (2 minutes)

1. Go to: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
2. Connect your wallet
3. Request test ETH (you'll need ~0.1 ETH for deployment)

## Step 2: Set Up Base Sepolia Network in MetaMask

Add Base Sepolia to MetaMask:
- **Network Name**: Base Sepolia
- **RPC URL**: https://sepolia.base.org
- **Chain ID**: 84532
- **Currency Symbol**: ETH
- **Block Explorer**: https://sepolia.basescan.org

## Step 3: Create a Deployment Wallet (Optional but Recommended)

For hackathons, it's safe to create a temporary deployment wallet:

1. In MetaMask, create a new account
2. Send some test ETH to this account
3. Use this account's private key for deployment

## Step 4: Deploy Smart Contract

```bash
cd ~/Desktop/base-splitwise

# Create .env file
echo "PRIVATE_KEY=your_private_key_here_without_0x" > .env

# Deploy
forge script script/Deploy.s.sol:DeployScript --rpc-url https://sepolia.base.org --broadcast -vvvv
```

## Step 5: Deploy Frontend to Vercel

The easiest way is through GitHub:

1. Your code is already on GitHub ✅
2. Go to https://vercel.com
3. Sign in with GitHub
4. Click "Import Project"
5. Select your `base-splitwise` repository
6. Configure:
   - Root Directory: `frontend`
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Install Command: `npm install --legacy-peer-deps`
7. Add Environment Variable:
   - Name: `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - Value: (the address from step 4)
8. Click "Deploy"

## Troubleshooting

### "Insufficient funds" error
- Make sure you have test ETH on Base Sepolia (not mainnet!)
- Check you're using the correct network

### "Invalid private key" error
- Remove the "0x" prefix from your private key
- Make sure there are no spaces or quotes

### Frontend build errors on Vercel
- Make sure you set the root directory to `frontend`
- Use the install command with `--legacy-peer-deps`

## Demo Ready! 🎉

Your app will be live at: `https://base-splitwise.vercel.app`

### Quick Demo Script
1. "This is Base Splitwise - like Splitwise but onchain"
2. "Users can create groups and track shared expenses"
3. "The smart contract automatically calculates who owes whom"
4. "It suggests optimal settlements to minimize transactions"
5. "Everything is transparent and recorded on Base"