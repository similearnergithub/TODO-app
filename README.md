# TODO-app

# 📋 ToDo List Application

A full-stack ToDo List application built with React, Node.js, Express, and MongoDB with AI-powered daily summaries using Groq API.

## 🎯 Features

✅ **User Authentication**: JWT-based login and registration
✅ **Task Management**: Create, Read, Update, Delete tasks
✅ **Task Organization**: Group tasks by Today, Upcoming, and Completed
✅ **Task Priority**: Set priority levels (Low, Medium, High)
✅ **Task Filtering**: Sort and filter tasks by date and priority
✅ **AI Summaries**: Generate daily task summaries using Groq API
✅ **Responsive Design**: Works on desktop and mobile
✅ **Docker Support**: Easy deployment with Docker and Docker Compose

## 🚀 Quick Start

### Option 1: Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   cd todoo
   ```

2. **Set up environment variables**
   - Backend: Edit `server/.env` (for local/non-Docker backend runs)
   ```
   MONGODB_URI=mongodb://localhost:27017/todo-app
   JWT_SECRET=change_this_to_a_strong_secret
   PORT=5000
   GROQ_API_KEY=your_groq_api_key_here
   NODE_ENV=development
   ```

3. **Add Groq API Key**
   - Get your API key from [Groq Console](https://console.groq.com)
   - Add it to: `server/.env` as `GROQ_API_KEY=your_key_here`
   - Also update `docker-compose.yml` environment section

4. **Run with Docker**
   ```bash
   docker-compose up --build
   ```
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001
   - MongoDB: mongodb://localhost:27017

### Option 2: Manual Setup

#### Backend Setup
```bash
cd server
npm install
# Update .env file
npm run dev
```

#### Frontend Setup
```bash
cd client
npm install
# Update .env file if needed
npm run dev
```

## 📁 Project Structure

```
todoo/
├── server/
│   ├── models/          # Database schemas (User, Todo, Summary)
│   ├── routes/          # API routes (auth, todos, summary)
│   ├── middleware/      # JWT authentication middleware
│   ├── server.js        # Main server file
│   ├── package.json
│   ├── .env
│   └── Dockerfile
├── client/
│   ├── src/
│   │   ├── pages/       # React pages (Login, Register, Dashboard)
│   │   ├── components/  # Reusable components
│   │   ├── services/    # API service calls
│   │   ├── App.jsx
│   │   └── App.css
│   ├── package.json
│   ├── .env
│   ├── vite.config.js
│   └── Dockerfile
├── docker-compose.yml
└── .gitignore
```

## 🔐 Groq API Integration

The app uses Groq API to generate AI-powered daily summaries of completed tasks.

### Where to Add Groq API Key:

1. **Development (Backend)**
   - File: `server/.env`
   - Add: `GROQ_API_KEY=gsk_xxxxxxxxxxxxx`

2. **Docker Setup**
   - File: `docker-compose.yml`
   - Update the `backend` service environment section
   - Or create `.env.docker` and pass it to compose

3. **Frontend**
   - The frontend doesn't need the key directly
   - All API calls go through the backend

### How to Get Groq API Key:

1. Visit [Groq Console](https://console.groq.com)
2. Sign up/Login
3. Create API Key
4. Copy the key and add to `.env` files

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Todo Endpoints
- `POST /api/todos` - Create new todo
- `GET /api/todos` - Get all todos for user
- `GET /api/todos/:id` - Get single todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

### Summary Endpoints
- `POST /api/summary/generate` - Generate today's summary
- `GET /api/summary/history` - Get summary history

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite
- Axios
- React Router

**Backend:**
- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing

**External APIs:**
- Groq AI API (for summaries)

**DevOps:**
- Docker
- Docker Compose

## 📝 Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### Todo
```javascript
{
  userId: ObjectId (ref: User),
  title: String,
  description: String,
  dueDate: Date,
  priority: String (low/medium/high),
  completed: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Summary
```javascript
{
  userId: ObjectId (ref: User),
  date: Date,
  summary: String,
  tasksCompleted: [ObjectId] (ref: Todo),
  createdAt: Date
}
```

## 🚀 Deployment

### Using Docker Compose
```bash
# Build and start all services
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

### With MongoDB Atlas (Cloud)
Update `MONGODB_URI` in `.env` with your MongoDB Atlas connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todo-app
```

## 🔧 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/todo-app
JWT_SECRET=your_secret_key
PORT=5000
GROQ_API_KEY=your_groq_key
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api

# If backend runs in Docker via docker-compose port mapping:
# VITE_API_URL=http://localhost:5001/api
```

## 📱 Features Guide

### Create Task
1. Click "+ Add Task" button
2. Fill in Title, Description, Due Date, Priority
3. Click "Create Task"

### Organize Tasks
Tasks are automatically grouped into:
- **Today's Focus**: Tasks due today
- **Upcoming**: Tasks due in future
- **Completed**: Finished tasks

### Generate Summary
1. Complete some tasks
2. Click "📊 Generate Daily Summary"
3. Groq AI will summarize your completed tasks
4. View or copy the summary

## ⚡ Performance Tips

- Use MongoDB Atlas for production
- Enable Docker for consistent deployment
- Set up proper indexes on MongoDB
- Use environment variables for secrets
- Implement pagination for large task lists

## 🐛 Troubleshooting

**Groq API Error?**
- Check API key is valid
- Verify network connection
- Check API limits on Groq dashboard

**MongoDB Connection Failed?**
- Verify MongoDB is running
- Check connection string
- Ensure credentials are correct

**Port Already in Use?**
- Change port in `.env` and docker-compose
- Or kill existing process on that port



---

