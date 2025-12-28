import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, hasRole, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <h3>Loading...</h3>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but wrong role, redirect to appropriate dashboard
  if (allowedRoles && allowedRoles.length > 0) {
    const userHasPermission = allowedRoles.some(role => hasRole(role));
    
    if (!userHasPermission) {
      // Redirect to correct dashboard based on user role
      if (hasRole('admin')) {
        return <Navigate to="/admindashboard" replace />;
      }
      if (hasRole('doctor')) {
        return <Navigate to="/doctordashboard" replace />;
      }
      return <Navigate to="/" replace />;
    }
  }

  // If everything is okay, render the children
  return children;
};

export default ProtectedRoute;