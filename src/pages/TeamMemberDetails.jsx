import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaEnvelope, FaPhone, FaCalendarAlt, FaTasks } from 'react-icons/fa';

const TeamMemberDetails = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [member, setMember] = useState(null);
  const [memberTasks, setMemberTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        // Fetch member details
        const memberResponse = await fetch(`http://localhost:5000/api/users/${id}`, {
          headers: {
            'x-auth-token': token
          }
        });

        if (!memberResponse.ok) {
          throw new Error('Failed to fetch team member details');
        }

        const memberData = await memberResponse.json();
        setMember(memberData);

        // Fetch member's tasks
        const tasksResponse = await fetch(`http://localhost:5000/api/tasks?assignedTo=${id}`, {
          headers: {
            'x-auth-token': token
          }
        });

        if (!tasksResponse.ok) {
          throw new Error('Failed to fetch member tasks');
        }

        const tasksData = await tasksResponse.json();
        setMemberTasks(tasksData);
      } catch (err) {
        console.error('Error fetching member details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberDetails();
  }, [id, token]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
    );
  }

  if (!member) {
    return (
        <div className="p-6">
          <div className="text-center text-gray-600">Team member not found</div>
        </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Member Profile */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-medium">
              {member.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{member.name}</h1>
              <p className="text-gray-600 capitalize">{member.role}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-2 text-gray-600">
              <FaEnvelope className="text-gray-400" />
              <span>{member.email}</span>
            </div>
            {member.phone && (
              <div className="flex items-center space-x-2 text-gray-600">
                <FaPhone className="text-gray-400" />
                <span>{member.phone}</span>
              </div>
            )}
            <div className="flex items-center space-x-2 text-gray-600">
              <FaCalendarAlt className="text-gray-400" />
              <span>Joined {new Date(member.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Member Tasks */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Assigned Tasks</h2>
            <div className="flex items-center space-x-2">
              <FaTasks className="text-gray-400" />
              <span className="text-gray-600">{memberTasks.length} tasks</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {memberTasks.map(task => (
                  <tr key={task._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{task.title}</div>
                      <div className="text-sm text-gray-500">{task.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.priority}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {memberTasks.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No tasks assigned to this team member.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamMemberDetails; 