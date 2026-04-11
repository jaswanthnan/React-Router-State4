# HRMS Dashboard Application

A powerful, full-stack Human Resource Management System (HRMS) designed to simplify tracking candidates and managing active job postings. Built with a sleek, modern, and highly responsive user interface.

## 🚀 Key Features

*   **Dynamic Analytics Dashboard**: Visual KPI metrics automatically synchronized with your database, featuring interactive Bar, Pie, and Timeline graphs using `Recharts`.
*   **Candidates Management**: Full CRUD operations for tracking applicants. Features bulk selection, dynamic status tagging (Hired, Pending, In Review), and intelligent pagination.
*   **Active Job Postings**: Track cross-departmental hiring needs (Engineering, Design, Marketing) with instant DB saves and responsive layouts.
*   **Advanced Data Grid**: Powered by `AG Grid`, supporting blazing fast Quick Search, dynamic layout autoHeights, multi-row selections, and CSV Exports.
*   **Safety Overrides**: Built-in modal safety protections utilizing Ant Design to prevent unsaved data loss on accidental closures.

## 🛠 Tech Stack

**Frontend**
*   **React + Vite**: For lightning-fast rendering and instantaneous hot-module reloads.
*   **Tailwind CSS**: For custom, utility-first styling and strict box-shaped designs.
*   **Ant Design (AntD)**: Premium UI components for Layout, Modals, Forms, and Dropdowns.
*   **AG Grid**: Enterprise-grade data visualization tools and table management.

**Backend**
*   **Node.js & Express.js**: Lightweight and extremely fast REST APIs.
*   **MongoDB & Mongoose**: Flexible document storage managing the `Candidate` and `Job` data schemas.

## 📂 Project Structure

```text
React Route4/
├── backend/
│   ├── models/
│   │   ├── Candidate.js       # Mongoose Candidate Schema
│   │   └── Job.js             # Mongoose Job Schema
│   └── server.js              # Express API Server & Endpoints
├── src/
│   ├── components/
│   │   ├── layout/            # AntD Sidebar & Navigation shells
│   │   └── ui/                # Reusable UI components
│   ├── context/
│   │   └── AppContext.jsx     # Global React State Management
│   ├── pages/
│   │   ├── Candidates/        # Candidates AG Grid & Form Logic
│   │   ├── Dashboard/         # Recharts Analytics Dashboard 
│   │   └── Jobs/              # Jobs AG Grid & Dashboard Logic
│   ├── services/
│   │   └── api.js             # Backend Axios API routing
│   ├── App.jsx                # Root Application Component
│   ├── index.css              # Global Tailwind Directives
│   └── main.jsx               # React DOM Entry Point
└── package.json               # Dependencies & Scripts
```

## 💻 Installation & Setup

1. **Clone the repository and ensure you have Node.js and MongoDB installed.**
   Make sure your local MongoDB instance is running on `mongodb://127.0.0.1:27017`

2. **Install Frontend Dependencies** (Root Folder)
   ```bash
   npm install
   ```

3. **Install Backend Dependencies** (Backend Folder)
   ```bash
   cd backend
   npm install
   ```

## ⚙️ Running the Application

You need two active terminals to run this full-stack application simultaneously.

**Terminal 1 (Start the Backend Server):**
```bash
cd backend
node server.js
```
*(The server will boot on port 5000 and confirm connection to MongoDB)*

**Terminal 2 (Start the Frontend UI):**
```bash
# From the root directory
npm run dev
```

The application will launch on your local host (typically `http://localhost:5173`).

## 🧪 Seeding Test Data

If you are running the application for the first time and your interface is completely empty, navigate to either the **Candidates** or **Jobs** page.

An empty state will prompt you to click the **"Seed Test Data to MongoDB"** button. Clicking this will run an automated script dropping robust dummy data directly into your backend to fully populate the Dashboard graphs and grids!
