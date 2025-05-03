import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaPlus, FaSearch, FaUserPlus, FaEnvelope, FaPhone, FaUser, FaInfoCircle, FaCopy, FaUsers, FaUserShield } from 'react-icons/fa';

const Team = () => {
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [teamInfo, setTeamInfo] = useState(null);
  const [inviteCode, setInviteCode] = useState('');
  const [showInviteCode, setShowInviteCode] = useState(false);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        // First, get the team information
        const teamResponse = await fetch('http://localhost:5000/api/teams/my-team', {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json'
          }
        });

        if (!teamResponse.ok) {
          if (teamResponse.status === 404) {
            // User is not part of any team
            setTeamInfo(null);
            setLoading(false);
            return;
          }
          throw new Error('Failed to fetch team information');
        }

        const teamData = await teamResponse.json();
        setTeamInfo(teamData);

        // Then fetch team members
        const membersResponse = await fetch('http://localhost:5000/api/teams/members', {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json'
          }
        });

        if (!membersResponse.ok) {
          throw new Error('Failed to fetch team members');
        }

        const membersData = await membersResponse.json();
        setTeamMembers(membersData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching team data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [token]);

  const handleGenerateInviteCode = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/users/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to generate invite code');
      }

      setInviteCode(data.code);
      setShowInviteCode(true);
    } catch (err) {
      console.error('Error generating invite code:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setSuccess('Code copied to clipboard!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const filteredMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FaInfoCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user is not part of any team
  if (!teamInfo && user?.role === 'team-member') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-blue-100 rounded-full">
              <FaUsers className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Join a Team</h2>
              <p className="text-gray-600">You haven't joined any team yet.</p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-6">
            <p className="text-blue-800 mb-4">
              To join a team, you need an invite code from your team manager. Once you have the code, you can join the team.
            </p>
            <button
              onClick={() => navigate('/choose-role')}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <FaUserPlus className="mr-2" />
              Join Team
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If user is a manager without a team
  if (!teamInfo && user?.role === 'manager') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-blue-100 rounded-full">
              <FaUserShield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create Your Team</h2>
              <p className="text-gray-600">You haven't created a team yet.</p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-6">
            <p className="text-blue-800 mb-4">
              As a manager, you need to create a team first. This will allow you to invite team members and manage your team.
            </p>
            <button
              onClick={handleGenerateInviteCode}
              disabled={loading}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Team...' : 'Create Team'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FaInfoCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Team Info */}
      {teamInfo && (
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <FaUsers className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{teamInfo.name}</h2>
                <p className="text-gray-600">
                  Managed by {teamInfo.manager.name}
                </p>
              </div>
            </div>
            {user?.role === 'manager' && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleGenerateInviteCode}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Generating...' : 'Generate Invite Code'}
                </button>
              </div>
            )}
          </div>
          
          {showInviteCode && (
            <div className="mt-6 bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Invite Code</h3>
              <div className="flex items-center space-x-4">
                <div className="flex-1 bg-white rounded-lg p-4 border border-gray-200">
                  <code className="text-lg font-mono text-gray-900">{inviteCode}</code>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  title="Copy to clipboard"
                >
                  <FaCopy className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Share this code with team members. They can use it to join your team.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search team members..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map(member => (
          <div key={member._id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-medium">
                  {member.name.charAt(0)}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{member.role}</p>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <FaEnvelope className="mr-2 text-gray-400" />
                <span>{member.email}</span>
              </div>
              {member.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <FaPhone className="mr-2 text-gray-400" />
                  <span>{member.phone}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Joined {new Date(member.createdAt).toLocaleDateString()}
                </span>
                <Link
                  to={`/dashboard/team/${member._id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex flex-col items-center">
              <FaUsers className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'No members match your search criteria.' : 'No members have joined the team yet.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team; 