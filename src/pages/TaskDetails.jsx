import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const TaskDetails = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch task details');
        }
        const data = await response.json();
        setTask(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id, token]);

  if (loading) return <div className="p-6">Loading task details...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!task) return <div className="p-6">Task not found.</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Task Details</h1>
      <div className="mb-2"><strong>Title:</strong> {task.title}</div>
      <div className="mb-2"><strong>Description:</strong> {task.description}</div>
      <div className="mb-2"><strong>Status:</strong> {task.status}</div>
      <div className="mb-2"><strong>Priority:</strong> {task.priority}</div>
      <div className="mb-2"><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</div>
      <div className="mb-2"><strong>Assigned To:</strong> {task.assignedTo?.name || 'Unassigned'}</div>
      <div className="mb-2"><strong>Created By:</strong> {task.createdBy?.name || 'Unknown'}</div>
    </div>
  );
};

export default TaskDetails; 