import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from 'react-bootstrap';
import { FaSignOutAlt } from 'react-icons/fa';

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      // Call Laravel logout API
      await fetch('http://127.0.0.1:8000/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with logout even if API fails
    }

    // Clear local state and storage
    logout();
    
    // Redirect to home page
    navigate('/');
  };

  return (
    <Button 
      variant="outline-danger" 
      onClick={handleLogout}
      className="d-flex align-items-center gap-2"
    >
      <FaSignOutAlt /> Logout
    </Button>
  );
};

export default LogoutButton;