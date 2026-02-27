import { useState, useEffect } from 'react'

function CreateTaskModal({ onClose, onSave, editingTask }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('medium')

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title)
      setDescription(editingTask.description || '')
      setPriority(editingTask.priority || 'medium')
      if (editingTask.dueDate) {
        const date = new Date(editingTask.dueDate)
        setDueDate(date.toISOString().split('T')[0])
      }
    }
  }, [editingTask])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) {
      alert('Please enter a title')
      return
    }

    onSave({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority
    })
  }

  return (
    <div className="create-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Due Date:</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Priority:</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="submit">{editingTask ? 'Update Task' : 'Create Task'}</button>
            <button type="button" onClick={onClose} className="secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTaskModal
