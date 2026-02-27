import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { summaryAPI } from '../services/api'

function SummaryHistory() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const res = await summaryAPI.getHistory()
      setHistory(res.data)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load summary history')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Summary history</h1>
        <div className="header-meta">
          <button onClick={() => navigate('/dashboard')} className="secondary">Back to dashboard</button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">Loading summary history...</div>
      ) : history.length === 0 ? (
        <p className="empty-state">No archived summaries yet.</p>
      ) : (
        <div className="history-list">
          {history.map((entry) => (
            <article key={entry._id} className="history-card">
              <div className="history-header">
                <h3>{new Date(entry.date || entry.createdAt).toLocaleDateString()}</h3>
                <span className="badge">{entry.completedCount ?? entry.tasksCompleted?.length ?? 0} completed</span>
              </div>

              {entry.tasksSnapshot?.length > 0 && (
                <ul className="summary-task-list">
                  {entry.tasksSnapshot.map((task, index) => (
                    <li key={`${entry._id}-${task.title}-${index}`}>
                      <span>{task.title}</span>
                      <span className={`task-priority priority-${task.priority}`}>{task.priority.toUpperCase()}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="summary-text">
                <strong>Brief summary</strong>
                <p>{entry.briefSummary || entry.summary}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default SummaryHistory
