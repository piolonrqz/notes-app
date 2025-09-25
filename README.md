# 📝 Notes App - Team JKWELEYN
![Project Status](https://img.shields.io/badge/Status-Prototype-blue)
![License](https://img.shields.io/badge/License-Educational%20Use-orange)

A full-stack notes application built by **Team Jakwelin** for efficient note-taking and organization.

<img width="1401" height="711" alt="image" src="https://github.com/user-attachments/assets/4af17ebb-ae20-4382-8d42-a98fac7175e1" />

## 🚀 Features

- ✨ Create, read, update, and delete notes
- 🔍 Search and filter notes
- 📂 Organize notes by categories
- 💾 Persistent storage with MongoDB
- ⚡ Fast and intuitive user interface

## 🛠️ Tech Stack

### Frontend
- **React** - User interface library
- **React Router** - Client-side routing
- **CSS3** - Styling and animations
- **Vite** - Build tool and development server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling


## 🚦 Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- [Git](https://git-scm.com/)

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


## 🎯 Usage

1. **Creating a Note**: Click the "Create Note" button and fill in the title and content
2. **Viewing Notes**: All notes are displayed on the homepage
3. **Editing a Note**: Click the edit button on any note card
4. **Deleting a Note**: Click the delete button on any note card
5. **Searching Notes**: Use the search bar to find specific notes

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

---

Made with ❤️ by Team Jakwelin
