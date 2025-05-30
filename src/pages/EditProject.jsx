import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const EditProject = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'pending',
    teamMembers: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchProjectAndTeamMembers = async () => {
      try {
        // Fetch project details
        const projectResponse = await fetch(`http://localhost:5000/api/projects/${id}`, {
          headers: {
            'x-auth-token': token
          }
        });

        if (!projectResponse.ok) {
          throw new Error('Failed to fetch project');
        }

        const projectData = await projectResponse.json();
        
        // Fetch all available team members
        const teamResponse = await fetch('http://localhost:5000/api/users', {
          headers: {
            'x-auth-token': token
          }
        });

        if (!teamResponse.ok) {
          throw new Error('Failed to fetch team members');
        }

        const teamData = await teamResponse.json();
        setTeamMembers(teamData.filter(member => member.role !== 'manager'));

        // Set form data with project details
        setFormData({
          name: projectData.name,
          description: projectData.description,
          startDate: projectData.startDate.split('T')[0],
          endDate: projectData.endDate.split('T')[0],
          status: projectData.status,
          teamMembers: projectData.teamMembers.map(member => member._id)
        });
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load project details');
      }
    };

    fetchProjectAndTeamMembers();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'startDate' || name === 'endDate') {
      const startDate = name === 'startDate' ? value : formData.startDate;
      const endDate = name === 'endDate' ? value : formData.endDate;
      
      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          endDate: name === 'startDate' ? '' : endDate
        }));
        setError('Start date cannot be after end date');
        return;
      } else {
        setError('');
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTeamMemberToggle = (memberId) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.includes(memberId)
        ? prev.teamMembers.filter(id => id !== memberId)
        : [...prev.teamMembers, memberId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to update project');
      }

      navigate('/manager-dashboard/projects');
    } catch (err) {
      console.error('Error updating project:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
            <p className="mt-2 text-sm text-gray-600">Update the project details below</p>
          </div>

          {error && (
            <div className="mx-8 mt-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Project Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter project name"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter project description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  min={formData.startDate}
                  className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Team Members
              </label>
              <div className="mt-1 relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {formData.teamMembers.length === 0 
                    ? 'Select team members' 
                    : `${formData.teamMembers.length} member(s) selected`}
                </button>
                
                {isDropdownOpen && (
                  <div 
                    className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
                    style={{ maxHeight: '250px', overflowY: 'auto' }}
                  >
                    {teamMembers.map(member => (
                      <label
                        key={member._id}
                        className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.teamMembers.includes(member._id)}
                          onChange={() => handleTeamMemberToggle(member._id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                        />
                        <span className="text-gray-700">{member.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/manager-dashboard/projects')}
                className="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default EditProject; 