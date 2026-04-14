# HRMS Dashboard Application

A full-stack Human Resources Management System (HRMS) dashboard built with React and Node.js. This application allows you to manage candidates, job postings, and view analytics in a modern, responsive interface.

## 🚀 Features

- **Dynamic Dashboard**: View interactive analytics with bar, pie, and line charts representing candidate statuses, job types, and departments.
- **Candidate Management**: Add, edit, delete, and view candidates in a responsive, filterable data grid.
- **Job Management**: Create and manage job postings, including full CRUD support integrated with a MongoDB backend.
- **Modern UI**: Polished layout leveraging Ant Design components, Tailwind CSS for utility styling, and custom routing with a 404 handler.
- **REST API**: Backend powered by Express.js and MongoDB to provide endpoints for candidates and job postings.

## 🛠️ Technology Stack

**Frontend:**
- **React.js (18.x)** with **Vite**
- **React Router DOM** for navigation
- **Ant Design** & **Bootstrap** for rapid UI component development
- **Tailwind CSS** for custom utility stylings
- **Recharts** for interactive data visualizations
- **AG Grid React** for powerful data tables

**Backend:**
- **Node.js** with **Express**
- **MongoDB** with **Mongoose** ORM
- **dotenv** for environment configuration
- **CORS** middleware enabled

## 📦 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites
- [Node.js](https://nodejs.org/en) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally on standard port (27017).

### 1. Installation

Clone the repository and install dependencies for both the frontend and backend.

```bash
# Install frontend dependencies
npm install

# Navigate to backend directory to install its dependencies 
# (if a separate package.json exists in backend, otherwise it runs from root)
```

### 2. Environment Variables

Create a `.env` file in the `backend` folder (or at the root, depending on your setup) and define the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/hrms-dashboard
```

### 3. Setup Initial Data (Optional)

You can seed the database with testing data using the provided seed route.

Run a POST request to `http://localhost:5000/api/seed` (using Postman or your browser) to populate initial `.candidates` and `.jobs` data schemas.

### 4. Running the Development Servers

You need to run both the frontend and backend servers concurrently.

**Start the Backend Server:**
Open a terminal instance and run:
```bash
npm run server
# Note: Ensure MongoDB service is running locally first.
```
*The backend will run on `http://localhost:5000/`*

**Start the Frontend Server:**
Open a separate terminal instance and run:
```bash
npm run dev
```
*The React app will be accessible at `http://localhost:5173/`*

## 📂 Project Structure

```text
├── backend/
│   ├── models/           # Mongoose Database Models (Candidate.js, Job.js)
│   └── server.js         # Express App and API Routes
├── src/
│   ├── components/       # Reusable UI layout & components (StatCards, ErrorMessage, etc.)
│   ├── context/          # React Contexts for global state management
│   ├── hooks/            # Custom React hooks (e.g. useFetch)
│   ├── pages/            # Application Pages
│   │   ├── Dashboard/    # Analytics view with Recharts
│   │   ├── Candidates/   # Candidate management views
│   │   ├── Jobs/         # Jobs CRUD interface
│   │   └── NotFound/     # 404 Fallback page 
│   ├── routes/           # React Router configuration
│   ├── services/         # API connection handlers
│   ├── App.jsx           # Root App Component
│   └── main.jsx          # React DOM entry
├── index.html            # Vite HTML template
├── package.json          # Dependencies and scripts
└── README.md             # Project documentation
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License

This project is licensed under the MIT License.
