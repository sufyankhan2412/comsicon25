import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Projects.css';

const ProjectsList = () => {
  const { token } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/projects', {
          headers: {
            'x-auth-token': token
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const data = await response.json();
        setProjects(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProjects();
  }, [token]);

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
          method: 'DELETE',
          headers: {
            'x-auth-token': token
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete project');
        }

        // Remove the deleted project from state
        setProjects(projects.filter(project => project._id !== projectId));
      } catch (err) {
        console.error('Error deleting project:', err);
        alert('Failed to delete project: ' + err.message);
      }
    }
  };

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'status') {
        return sortDirection === 'asc' 
          ? a.status.localeCompare(b.status) 
          : b.status.localeCompare(a.status);
      } else {
        return sortDirection === 'asc' 
          ? new Date(a[sortBy]) - new Date(b[sortBy]) 
          : new Date(b[sortBy]) - new Date(a[sortBy]);
      }
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="projects-list">
      <div className="page-header">
        <h1>Projects</h1>
        <Link to="/manager-dashboard/projects/new" className="btn btn-primary">
          <i className="fas fa-plus"></i> New Project
        </Link>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-options">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="projects-table-wrapper">
          <table className="projects-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} className={sortBy === 'name' ? `sorted-${sortDirection}` : ''}>
                  Project Name
                  {sortBy === 'name' && (
                    <i className={`fas fa-chevron-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                  )}
                </th>
                <th onClick={() => handleSort('status')} className={sortBy === 'status' ? `sorted-${sortDirection}` : ''}>
                  Status
                  {sortBy === 'status' && (
                    <i className={`fas fa-chevron-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                  )}
                </th>
                <th onClick={() => handleSort('startDate')} className={sortBy === 'startDate' ? `sorted-${sortDirection}` : ''}>
                  Start Date
                  {sortBy === 'startDate' && (
                    <i className={`fas fa-chevron-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                  )}
                </th>
                <th onClick={() => handleSort('dueDate')} className={sortBy === 'dueDate' ? `sorted-${sortDirection}` : ''}>
                  Due Date
                  {sortBy === 'dueDate' && (
                    <i className={`fas fa-chevron-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                  )}
                </th>
                <th>Tasks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map(project => (
                <tr key={project._id}>
                  <td>
                    <Link to={`/manager-dashboard/projects/${project._id}`} className="project-name-link">
                      {project.name}
                    </Link>
                    <div className="project-description">{project.description.substring(0, 60)}...</div>
                  </td>
                  <td>
                    <span className={`status-badge ${project.status}`}>{project.status}</span>
                  </td>
                  <td>{new Date(project.startDate).toLocaleDateString()}</td>
                  <td>{new Date(project.dueDate).toLocaleDateString()}</td>
                  <td className="task-count">{project.taskCount || 0}</td>
                  <td className="actions">
                    <Link to={`/manager-dashboard/projects/${project._id}`} className="btn-icon view">
                      <i className="fas fa-eye"></i>
                    </Link>
                    <Link to={`/manager-dashboard/projects/${project._id}/edit`} className="btn-icon edit">
                      <i className="fas fa-edit"></i>
                    </Link>
                    <button 
                      className="btn-icon delete"
                      onClick={() => handleDeleteProject(project._id)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <i className="fas fa-folder-open"></i>
          <h3>No projects found</h3>
          <p>Create your first project to get started</p>
          <Link to="/manager-dashboard/projects/new" className="btn btn-primary">
            <i className="fas fa-plus"></i> Create Project
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProjectsList;