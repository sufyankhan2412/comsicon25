import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const InviteMember = () => {
  const { token, user } = useContext(AuthContext);
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect non-managers
  if (user?.role !== 'manager') {
    return <Navigate to="/dashboard" />;
  }

  const handleGenerateCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const res = await fetch('http://localhost:5000/api/users/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        }
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.msg || 'Failed to generate invite code');
      }
      
      setInviteCode(data.code);
      setSuccess('Invite code generated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setSuccess('Code copied to clipboard!');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-100 py-8">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-10">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Generate Team Invite Code</h2>
        
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded relative" role="alert">
            {success}
          </div>
        )}

        <div className="space-y-6">
          <button
            onClick={handleGenerateCode}
            disabled={loading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Generate New Invite Code'}
          </button>

          {inviteCode && (
            <div className="mt-6">
              <div className="font-semibold mb-2 text-gray-700">Invite Code:</div>
              <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg flex items-center justify-between">
                <span className="font-mono text-blue-700 text-base select-all">{inviteCode}</span>
                <button
                  onClick={handleCopyCode}
                  className="ml-3 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  Copy
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Share this code with team members. They can use it to join your team.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InviteMember; 