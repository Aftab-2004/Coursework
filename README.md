# E-Voting App

A decentralized voting application built on the Ethereum blockchain using the MERN stack (MongoDB, Express.js, React.js, Node.js) and Solidity smart contracts.

![Ethereum Blockchain](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMaBZJ-VFnDKbUbDKJfIIFhgYhBvVH1_eDtA&usqp=CAU)

## Overview

This project implements a secure and transparent electronic voting system using blockchain technology. It leverages the Ethereum blockchain to ensure the integrity and immutability of votes, while providing a user-friendly interface for both administrators and voters.

## Features

- **Admin Panel**
  - Create and manage elections
  - Add candidates to elections
  - Monitor election results in real-time
  - View voter participation statistics

- **Voter Interface**
  - View active elections
  - Cast votes securely
  - Verify vote registration on blockchain
  - View election results

## Technology Stack

### Frontend
- React.js
- Web3.js
- Material-UI (for styling)

### Backend
- Node.js
- Express.js
- MongoDB

### Blockchain
- Ethereum
- Solidity (Smart Contracts)
- Truffle (Development Framework)
- Ganache (Local Blockchain)

### Additional Tools
- MetaMask (Ethereum Wallet)
- npm (Package Manager)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher)
- Ganache
- MetaMask browser extension
- MongoDB

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd E-Voting-App
```

2. Install dependencies for the blockchain component:
```bash
cd blockchain
npm install
```

3. Install dependencies for the server:
```bash
cd ../server
npm install
```

4. Install dependencies for the frontend:
```bash
cd ../src
npm install
```

## Configuration

1. Set up Ganache:
   - Install and run Ganache
   - Create a new workspace
   - Note the RPC server address (usually http://127.0.0.1:7545)

2. Configure MetaMask:
   - Install the MetaMask browser extension
   - Connect to your local Ganache network
   - Import accounts from Ganache

3. Deploy Smart Contracts:
```bash
cd blockchain
truffle migrate --reset
```

## Running the Application

1. Start the blockchain development server:
```bash
cd blockchain
npm start
```

2. Start the backend server:
```bash
cd server
npm run dev
```

3. Start the frontend development server:
```bash
cd src
npm start
```

## Security Features

- Smart contract-based vote verification
- Encrypted voter authentication
- Immutable vote records on blockchain
- Real-time vote counting and verification

