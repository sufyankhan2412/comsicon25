// context/AuthContext.js
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await fetch('http://localhost:5000/api/users/me', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token
            },
            credentials: 'include'
          });
          
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
          } else {
            // Token invalid
            console.error('Token invalid');
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
          }
        } catch (err) {
          console.error('Error loading user', err);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      } else {
        setLoading(false);
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (userData, authToken) => {
    try {
      localStorage.setItem('token', authToken);
      setToken(authToken);
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!token && !!user,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};