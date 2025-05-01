import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Projects.css';

const CreateProject = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'pending',
    startDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    teamMembers: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch team members for assignment
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users', {
          headers: {
            'x-auth-token': token
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        // Filter to only include team members
        setUsers(data.filter(user => user.role === 'team-member'));
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch team members. Please try again later.');
      }
    };

    fetchUsers();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTeamMemberChange = (e) => {
    const options = e.target.options;
    const selectedMembers = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedMembers.push(options[i].value);
      }
    }
    setFormData(prev => ({
      ...prev,
      teamMembers: selectedMembers
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to create project');
      }

      const data = await response.json();
      navigate(`/manager-dashboard/projects/${data._id}`);
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="create-project">
      <div className="page-header">
        <h1>Create New Project</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="card project-form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Project Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter project name"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe the project"
              className="form-control"
              rows="4"
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-control"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="startDate">Start Date *</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Due Date *</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                className="form-control"
                min={formData.startDate}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="teamMembers">Team Members</label>
            <select
              id="teamMembers"
              name="teamMembers"
              multiple
              value={formData.teamMembers}
              onChange={handleTeamMemberChange}
              className="form-control"
              size="5"
            >
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            <small className="form-text">Hold Ctrl (or Cmd on Mac) to select multiple team members</small>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/manager-dashboard/projects')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;