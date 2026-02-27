import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { todoAPI, summaryAPI } from '../services/api'
import CreateTaskModal from '../components/CreateTaskModal'
import SummaryModal from '../components/SummaryModal'

function Dashboard({ onLogout }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showSummaryModal, setShowSummaryModal] = useState(false)
  const [summaryData, setSummaryData] = useState(null)
  const [editingTask, setEditingTask] = useState(null)
  const [expandedTaskId, setExpandedTaskId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await todoAPI.getAll()
      setTasks(res.data)
      setError('')
    } catch (err) {
      setError('Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (taskData) => {
    try {
      if (editingTask) {
        await todoAPI.update(editingTask._id, taskData)
        setEditingTask(null)
      } else {
        await todoAPI.create(taskData)
      }
      fetchTasks()
      setShowCreateModal(false)
    } catch (err) {
      setError('Failed to save task')
    }
  }

  const handleDeleteTask = async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        await todoAPI.delete(id)
        fetchTasks()
      } catch (err) {
        setError('Failed to delete task')
      }
    }
  }

  const handleToggleComplete = async (task) => {
    try {
      await todoAPI.update(task._id, { completed: !task.completed })
      fetchTasks()
    } catch (err) {
      setError('Failed to update task')
    }
  }

  const handleGenerateSummary = async () => {
    try {
      const res = await summaryAPI.generate()
      setSummaryData({
        completedCount: res.data.completedCount || 0,
        tasks: res.data.tasks || [],
        briefSummary: res.data.briefSummary || res.data.summary || 'No summary available.'
      })
      setShowSummaryModal(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate summary')
    }
  }

  const handleToggleExpand = (taskId) => {
    setExpandedTaskId((current) => (current === taskId ? null : taskId))
  }

  const groupTasksByDate = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const priorityOrder = { high: 0, medium: 1, low: 2 }
    const sortByPriority = (a, b) => {
      const aRank = priorityOrder[a.priority] ?? 3
      const bRank = priorityOrder[b.priority] ?? 3
      return aRank - bRank
    }

    const todayTasks = tasks
      .filter(t => !t.completed && t.dueDate && new Date(t.dueDate) >= today && new Date(t.dueDate) < tomorrow)
      .sort(sortByPriority)

    const upcomingTasks = tasks
      .filter(t => !t.completed && t.dueDate && new Date(t.dueDate) >= tomorrow)
      .sort(sortByPriority)

    const completedTasks = tasks
      .filter(t => t.completed)
      .sort(sortByPriority)

    return { todayTasks, upcomingTasks, completedTasks }
  }

  if (loading) return <div className="container"><div className="loading">Loading tasks...</div></div>

  const { todayTasks, upcomingTasks, completedTasks } = groupTasksByDate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  return (
    <div className="container">
      <div className="header">
        <h1>Task Management</h1>
        <div className="header-meta">
          <span>Signed in as {user.name}</span>
          <button onClick={onLogout} className="secondary">Logout</button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="actions-row">
        <button onClick={() => { setEditingTask(null); setShowCreateModal(true) }}>Add task</button>
        <button onClick={handleGenerateSummary} className="secondary">Generate daily summary</button>
        <button onClick={() => navigate('/summary-history')} className="secondary">Summary history</button>
      </div>

      {showCreateModal && (
        <CreateTaskModal
          onClose={() => { setShowCreateModal(false); setEditingTask(null) }}
          onSave={handleCreateTask}
          editingTask={editingTask}
        />
      )}

      {showSummaryModal && (
        <SummaryModal
          summaryData={summaryData}
          onClose={() => setShowSummaryModal(false)}
        />
      )}

      {/* Today's Tasks */}
      <div className="tasks-section">
        <div className="section-header">
          <h2>Today</h2>
          <span className="badge">{todayTasks.length}</span>
        </div>
        {todayTasks.length === 0 ? (
          <p className="empty-state">No tasks due today!</p>
        ) : (
          <div className="task-list">
            {todayTasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                isExpanded={expandedTaskId === task._id}
                onToggleExpand={() => handleToggleExpand(task._id)}
                onToggle={() => handleToggleComplete(task)}
                onEdit={() => { setEditingTask(task); setShowCreateModal(true) }}
                onDelete={() => handleDeleteTask(task._id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Tasks */}
      <div className="tasks-section">
        <div className="section-header">
          <h2>Upcoming</h2>
          <span className="badge">{upcomingTasks.length}</span>
        </div>
        {upcomingTasks.length === 0 ? (
          <p className="empty-state">No upcoming tasks!</p>
        ) : (
          <div className="task-list">
            {upcomingTasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                isExpanded={expandedTaskId === task._id}
                onToggleExpand={() => handleToggleExpand(task._id)}
                onToggle={() => handleToggleComplete(task)}
                onEdit={() => { setEditingTask(task); setShowCreateModal(true) }}
                onDelete={() => handleDeleteTask(task._id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Completed Tasks */}
      <div className="tasks-section">
        <div className="section-header">
          <h2>Completed</h2>
          <span className="badge">{completedTasks.length}</span>
        </div>
        {completedTasks.length === 0 ? (
          <p className="empty-state">No completed tasks yet!</p>
        ) : (
          <div className="task-list">
            {completedTasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                isExpanded={expandedTaskId === task._id}
                onToggleExpand={() => handleToggleExpand(task._id)}
                onToggle={() => handleToggleComplete(task)}
                onEdit={() => { setEditingTask(task); setShowCreateModal(true) }}
                onDelete={() => handleDeleteTask(task._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function TaskCard({ task, isExpanded, onToggleExpand, onToggle, onEdit, onDelete }) {
  const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''} ${task.priority} ${isExpanded ? 'expanded' : ''}`} onClick={onToggleExpand}>
      <div className="task-header single-line">
        <div className="task-main">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={(event) => {
              event.stopPropagation()
              onToggle()
            }}
            className="task-checkbox"
          />
          <span className="task-title">{task.title}</span>
        </div>
        <div className="task-meta">
          <span className="task-duedate">Due {dueDate}</span>
          <span className={`task-priority priority-${task.priority}`}>{task.priority.toUpperCase()}</span>
          <div className="task-actions">
            <button onClick={(event) => { event.stopPropagation(); onEdit() }}>Edit</button>
            <button onClick={(event) => { event.stopPropagation(); onDelete() }} className="danger">Delete</button>
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="task-description">
          {task.description || 'No description for this task.'}
        </div>
      )}
    </div>
  )
}

export default Dashboard
