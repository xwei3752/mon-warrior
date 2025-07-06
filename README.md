# Mon Warrior Game

A Next.js frontend for interacting with the WeaponNFT and Dragon smart contracts. This application allows users to mint weapon NFTs and use them to battle a dragon.

## Features

- Connect your Ethereum wallet
- Mint unique weapon NFTs by sending 1 TMON
- Monad-themed UI
- Responsive design

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MetaMask or another Ethereum wallet

## Getting Started

1. Clone the repository

2. Install dependencies:
```bash
cd frontend
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Connect your wallet using the "Connect Wallet" button
2. Ensure you have at least 1 TMON in your wallet
3. Click the "Mint Weapon" button to mint a new weapon NFT
4. Wait for the transaction to be confirmed
5. Your weapon will start at level 1 and level up every 24 hours

## Contract Addresses

The application is configured to work with the following contracts:

- WeaponNFT: `0xbd605dfe16862f00631856a5c1ef5dc658a814a1` 
- Dragon: `0x8dC7eD1F4738098765F074880a7f9fc71cBFCCFA` 
To use different contract addresses, update the constants in `utils/constants.js`.

## Development

This project uses:

- Next.js for the frontend framework
- RainbowKit for wallet connection
- wagmi for Ethereum interactions
- ethers.js for blockchain communication

## License

ISC