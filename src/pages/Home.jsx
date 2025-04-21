// pages/dashboard/Home.js
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import "./Dashboard.css"

const Home = () => {
  const { user, token } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
    teamMembers: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tasks
        const tasksRes = await fetch('http://localhost:5000/api/tasks', {
          headers: {
            'x-auth-token': token
          }
        });
        
        if (!tasksRes.ok) {
          throw new Error('Failed to fetch tasks');
        }
        
        const tasks = await tasksRes.json();
        
        // Fetch users
        const usersRes = await fetch('http://localhost:5000/api/users', {
          headers: {
            'x-auth-token': token
          }
        });
        
        if (!usersRes.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const users = await usersRes.json();
        
        // Update stats
        setStats({
          totalTasks: tasks.length,
          pendingTasks: tasks.filter(task => task.status === 'pending').length,
          completedTasks: tasks.filter(task => task.status === 'completed').length,
          teamMembers: users.length
        });
        
        // Set recent tasks (newest 5)
        setRecentTasks(tasks.slice(0, 5));
        
        // Set team members
        setTeamMembers(users.slice(0, 5));
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [token]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'in-progress':
        return 'status-progress';
      default:
        return 'status-pending';
    }
  };
  
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      default:
        return 'priority-low';
    }
  };
  
  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }
  
  return (
    <div className="home-container">
      <header className="dashboard-header">
        <h1>Welcome back, {user.name}</h1>
        <p className="date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </header>
      
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon tasks-icon">
            <i className="fas fa-tasks"></i>
          </div>
          <div className="stat-details">
            <h3>Total Tasks</h3>
            <p className="stat-number">{stats.totalTasks}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon pending-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-details">
            <h3>Pending Tasks</h3>
            <p className="stat-number">{stats.pendingTasks}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon completed-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-details">
            <h3>Completed Tasks</h3>
            <p className="stat-number">{stats.completedTasks}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon team-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-details">
            <h3>Team Members</h3>
            <p className="stat-number">{stats.teamMembers}</p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-sections">
        <section className="recent-tasks">
          <div className="section-header">
            <h2>Recent Tasks</h2>
            <Link to="/dashboard/tasks" className="view-all">View All</Link>
          </div>
          
          {recentTasks.length === 0 ? (
            <p className="no-data">No tasks found</p>
          ) : (
            <div className="tasks-list">
              {recentTasks.map(task => (
                <div className="task-item" key={task._id}>
                  <div className="task-header">
                    <h3 className="task-title">{task.title}</h3>
                    <span className={`task-status ${getStatusClass(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                  <p className="task-description">{task.description}</p>
                  <div className="task-meta">
                    <div className="task-assignee">
                      <span className="meta-label">Assigned to:</span>
                      <span className="meta-value">{task.assignedTo.name}</span>
                    </div>
                    <div className="task-priority">
                      <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  {task.dueDate && (
                    <div className="task-due-date">
                      <i className="far fa-calendar-alt"></i>
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
        
        <section className="team-members">
          <div className="section-header">
            <h2>Team Members</h2>
          </div>
          
          {teamMembers.length === 0 ? (
            <p className="no-data">No team members found</p>
          ) : (
            <div className="members-list">
              {teamMembers.map(member => (
                <div className="member-item" key={member._id}>
                  <div className="member-avatar">
                    {member.name.charAt(0)}
                  </div>
                  <div className="member-details">
                    <h3 className="member-name">{member.name}</h3>
                    <p className="member-role">{member.role}</p>
                    <p className="member-email">{member.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;