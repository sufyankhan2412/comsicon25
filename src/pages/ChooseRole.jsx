import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ChooseRole() {
  const navigate = useNavigate();
  const { token, user, updateUser } = useContext(AuthContext);
  const [role, setRole] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/users/choose-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          role,
          inviteCode: role === 'team-member' ? inviteCode : undefined
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to set role');
      }

      // Update user data in context
      const updatedUser = { ...user, role, team: data.team };
      updateUser(updatedUser);

      // Navigate based on role
      if (role === 'manager') {
        navigate('/manager-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Role selection error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Choose Your Role
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Select your role to continue
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  id="manager"
                  name="role"
                  value="manager"
                  checked={role === 'manager'}
                  onChange={(e) => setRole(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="manager" className="ml-3 block">
                  <span className="text-sm font-medium text-gray-700">Manager</span>
                  <span className="text-sm text-gray-500 block mt-1">
                    Create and manage your own team
                  </span>
                </label>
              </div>

              <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  id="team-member"
                  name="role"
                  value="team-member"
                  checked={role === 'team-member'}
                  onChange={(e) => setRole(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="team-member" className="ml-3 block">
                  <span className="text-sm font-medium text-gray-700">Team Member</span>
                  <span className="text-sm text-gray-500 block mt-1">
                    Join an existing team
                  </span>
                </label>
              </div>
            </div>

            {role === 'team-member' && (
              <div>
                <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700">
                  Team Invite Code
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="inviteCode"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter the invite code provided by your team manager"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Ask your team manager for the invite code to join their team.
                </p>
              </div>
            )}

            <div>
              <button 
                type="submit" 
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !role || (role === 'team-member' && !inviteCode)}
              >
                {loading ? 'Processing...' : 'Continue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChooseRole; 