import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ManagerLayout from '../components/ManagerLayout';

const InviteMember = () => {
  const { token } = useContext(AuthContext);
  const [method, setMethod] = useState('code');
  const [email, setEmail] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    setInviteCode('');
    setInviteMessage('');
    try {
      const res = await fetch('http://localhost:5000/api/users/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(
          method === 'code'
            ? { method: 'code' }
            : { method: 'email', email }
        ),
      });
      const data = await res.json();
      if (method === 'code' && data.code) {
        setInviteCode(data.code);
      } else if (method === 'email' && data.message) {
        setInviteMessage(data.message);
      } else if (data.msg) {
        setInviteMessage(data.msg);
      }
    } catch (err) {
      setInviteMessage('Error sending invite.');
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ManagerLayout>
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-100 py-8">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-10">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Invite Team Member</h2>
          <form onSubmit={handleInvite} className="space-y-6">
            <div className="flex items-center justify-center gap-8 mb-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="code"
                  checked={method === 'code'}
                  onChange={() => setMethod('code')}
                  className="accent-blue-600"
                />
                <span className="ml-2 text-gray-700 font-medium">Invite by Code</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="email"
                  checked={method === 'email'}
                  onChange={() => setMethod('email')}
                  className="accent-blue-600"
                />
                <span className="ml-2 text-gray-700 font-medium">Invite by Email</span>
              </label>
            </div>
            {method === 'email' && (
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Invite'}
            </button>
          </form>
          {inviteCode && (
            <div className="mt-6">
              <div className="font-semibold mb-1 text-gray-700">Invite Code:</div>
              <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg flex items-center justify-between">
                <span className="font-mono text-blue-700 text-base select-all">{inviteCode}</span>
                <button
                  className="ml-3 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition relative"
                  onClick={handleCopy}
                  type="button"
                >
                  Copy
                  {copied && (
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs rounded px-2 py-1 shadow animate-fade-in-out" style={{zIndex: 10}}>
                      Copied!
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}
          {inviteMessage && (
            <div className="mt-6 text-green-600 text-center font-medium">{inviteMessage}</div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fade-in-out {
          0% { opacity: 0; transform: translateY(-10px) scale(0.95); }
          20% { opacity: 1; transform: translateY(0) scale(1); }
          80% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-10px) scale(0.95); }
        }
        .animate-fade-in-out {
          animation: fade-in-out 1.5s;
        }
      `}</style>
    </ManagerLayout>
  );
};

export default InviteMember; 