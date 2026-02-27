# 15-Minute Video Demo Script (Expanded + Easy Speaking)

## Project
**ToDoo – Task Management App with Daily AI Summary**

## Full Tech Stack (say this clearly)
### Frontend
- React
- Vite
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express
- Mongoose
- bcryptjs
- jsonwebtoken (JWT)
- cors
- dotenv

### Database
- MongoDB

### AI
- Groq API

### Dev / Run
- Docker
- Docker Compose
- Nodemon

---

## 0) Pre-Recording Checklist (30–45 sec)
- Open app in browser: `http://localhost:3000`
- Keep backend API running: `http://localhost:5001/api`
- Keep these files open in editor:
  - `client/src/App.jsx`
  - `client/src/pages/Dashboard.jsx`
  - `client/src/pages/SummaryHistory.jsx`
  - `client/src/components/SummaryModal.jsx`
  - `server/server.js`
  - `server/routes/auth.js`
  - `server/routes/todos.js`
  - `server/routes/summary.js`
  - `server/models/Summary.js`
  - `docker-compose.yml`

---

## 1) Quick Introduction (1 minute)
### Speak this:
Hi, my name is **[Your Name]** and I am from **[Your Background]**.

Today I am presenting my coding assignment project called **ToDoo**.
This is a task management app where users can:
- register and login,
- create and complete tasks,
- set priority,
- and generate a daily brief summary using AI.

Main goal of this project is simple:
help users track daily work and quickly understand what they finished.

---

## 2) Problem Statement & Approach (2 minutes)
### Speak this:
The assignment was to build a complete app from login to daily productivity tracking, with a clean user experience.

I solved it in this order:
1. Setup user authentication.
2. Build task CRUD (create, read, update, delete).
3. Add priority handling (High, Medium, Low).
4. Add completed tasks summary generation.
5. Save summaries in history.
6. Make the app run in Docker.

I kept the code separated by responsibility:
- frontend pages and components,
- backend routes,
- models for database.

This made the app easier to test and update.

---

## 3) Code Walkthrough + Live Demo (7–8 minutes)

## 3.1 Architecture (1 minute)
### Show this flowchart:


### Speak this:
User works on the frontend.
Frontend sends API requests to backend.
Backend checks token, processes data, saves tasks in MongoDB, and for daily brief summary it calls Groq.
Then backend sends final response back to frontend.

---

## 3.2 Backend Walkthrough (2 minutes)

### A) Server setup
- Open `server/server.js`

### Speak this:
This is the main backend entry file.
It connects database, loads middleware, and registers route files.
There is also a health endpoint to check if server and database are connected.

### B) Login/Register routes
- Open `server/routes/auth.js`

### Speak this:
This file handles user registration and login.
Password is hashed with bcryptjs.
After login or register, server returns JWT token for protected API use.

### C) Task routes
- Open `server/routes/todos.js`

### Speak this:
This file handles task actions:
add task, list tasks, update task, mark complete, and delete task.
Each task is linked to the logged-in user.

### D) Summary routes
- Open `server/routes/summary.js`
- Open `server/models/Summary.js`

### Speak this:
This is the AI summary part.
Backend picks today’s completed tasks, sends task descriptions to Groq, and gets a short brief summary.
Then server returns:
- completed task count,
- task list with priority,
- brief summary,
- source (groq/fallback).

It also stores summary history in database.

---

## 3.3 Frontend Walkthrough (2 minutes)

### A) Routing and theme
- Open `client/src/App.jsx`

### Speak this:
Here we handle page routes and route protection.
If user is not logged in, protected pages are blocked.
This file also has dark/light mode toggle.

### B) Dashboard page
- Open `client/src/pages/Dashboard.jsx`

### Speak this:
Dashboard shows task sections:
- Today,
- Upcoming,
- Completed.

Tasks are sorted by priority so high priority appears first.

### C) Summary modal
- Open `client/src/components/SummaryModal.jsx`

### Speak this:
After clicking “Generate daily summary”, this modal shows:
- how many tasks completed today,
- task names and priorities,
- brief AI summary.

### D) Summary history page
- Open `client/src/pages/SummaryHistory.jsx`

### Speak this:
This page displays archived summaries by date, so user can check previous progress.

---

## 3.4 Live Demo Steps (2–3 minutes)
### Do this and speak:
1. **Login**
  - “I will login with my account.”

2. **Create tasks**
  - Add 2–3 tasks.
  - Keep different priorities and meaningful descriptions.
  - “I am adding description because summary is generated from completed task details.”

3. **Complete tasks**
  - Mark tasks as complete.
  - “Now these tasks move into completed section.”

4. **Generate summary**
  - Click “Generate daily summary.”
  - “Now I can see completed count, task list with priority, and AI brief summary.”

5. **Open Summary History**
  - Click “Summary history.”
  - “Each generated summary is saved with date for later review.”

6. **Theme toggle**
  - Toggle dark/light mode.
  - “Theme setting improves readability and user comfort.”

---

## 4) Challenges & What I Improved (2 minutes)
### Speak this:
Main challenge was environment setup between local run and Docker run.
I solved this by cleaning configuration and proper environment variable mapping.

Another challenge was summary quality.
I improved it by sending task descriptions to Groq instead of only task titles.

I also improved:
- cleaner UI,
- task priority sorting,
- summary history page,
- and better flow for daily summary output.

---

## 5) Conclusion (2 minutes)
### Speak this:
In conclusion, ToDoo is a complete task tracking app with:
- secure login,
- task management,
- priority sorting,
- AI daily brief summary,
- and summary history.

This project shows full-stack development, API integration, and practical user-focused features.

Future enhancements can be:
- summary filters by date,
- reminder notifications,
- and team task collaboration.

Thank you.

---

## Quick Backup Q&A (Simple)

### Q1: Is Groq actually used?
A: Yes. API response includes `summarySource`. We tested and got `groq`.

### Q2: How is security handled?
A: Password is hashed, and protected routes require JWT token.

### Q3: Why summary history?
A: User can track progress from previous days.
