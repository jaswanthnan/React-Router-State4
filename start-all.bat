@echo off
echo =======================================================
echo Starting HRMS Dashboard Application (Frontend + Backend)
echo =======================================================

echo 1. Starting Node.js Backend Server on Port 5000...
start "HRMS - Backend Server" cmd /k "npm run server"

echo 2. Starting Vite React Frontend...
start "HRMS - Frontend Server" cmd /k "npm run dev"

echo Both servers are launching in separate windows! You can close this window.
pause
