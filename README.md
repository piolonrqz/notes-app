# 📝 Notes App - Team JKWELEYN
![Project Status](https://img.shields.io/badge/Status-Prototype-blue)
![License](https://img.shields.io/badge/License-Educational%20Use-orange)

A **Hybrid Web3 Notes Application** built by **Team JKWELEYN** that combines the speed of Web2 with the permanence and ownership of the Cardano blockchain.

<img width="1906" height="902" alt="image" src="https://github.com/user-attachments/assets/8c431685-7bdb-4772-b232-9e44f4800089" />



## 🚀 Features

- 📂 **Standard Features** - Create, edit, delete, archive, and search/filter notes.
- 🔐 **Zero-Knowledge Auth** - Login securely using only your Cardano Wallet (Lace/Nami).
- ⛓️ **Blockchain Permanence** - Every note is cryptographically signed and stored on the Cardano blockchain (Preview Network).
- ⚡ **Optimistic UI** - Instant save functionality using a local MongoDB cache while the blockchain confirms in the background.
- 📦 **Smart Chunking** - Automatically splits long notes into 64-byte chunks to fit Cardano metadata standards.
- 🔍 **Real-Time Sync** - Background workers verify transaction status via Blockfrost API.

## 🛠️ Tech Stack

### Blockchain & Web3
- **Cardano Preview Network** - Public ledger for note permanence.
- **MeshSDK** - Transaction building and wallet integration.
- **Blockfrost API** - Blockchain data verification service.
- **CIP-30 Wallets** - Support for Lace, Nami, Eternl, etc.

### Frontend
- **React (Vite)** - Fast, modern UI library.
- **TailwindCSS** - Responsive styling.
- **Lucide React** - Iconography.

### Backend
- **Node.js & Express** - API Server.
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

## 🚦 Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- **Cardano Wallet** (Lace or Nami) set to **Preview Testnet**.
- [Blockfrost](https://blockfrost.io/) Project ID (Preview Network).

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/notes-app.git
   cd notes-app
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Create environment file**
   ```bash
   # Create .env file in backend directory
   touch .env
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Start MongoDB** (if using local MongoDB)
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`


## 👥 Team Jakwelin

| Profile | Name                    | GitHub Username            |
|-----------------|-------------------------|----------------------------|
| <img src="https://avatars.githubusercontent.com/u/168988379?v=4" width="50"> | Jestopher Dela Torre       | [@JeckTupir](https://github.com/JeckTupir) |
| <img src="https://avatars.githubusercontent.com/u/114855573?v=4" width="50"> | Piolo Frances Enriquez     | [@piolonrqz](https://github.com/piolonrqz) |
| <img src="https://avatars.githubusercontent.com/u/112413548?v=4" width="50"> | Darwin Darryl Largoza      | [@Dadaisuk1](https://github.com/Dadaisuk1)  |
| <img src="https://avatars.githubusercontent.com/u/89176351?v=4" width="50">  | Nathan Rener Malagapo      | [@sytrusz](https://github.com/sytrusz)     |
| <img src="https://avatars.githubusercontent.com/u/169969184?v=4" width="50"> | Xyrill Dereck Canete       | [@Amarok1214](https://github.com/Amarok1214)  |

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
