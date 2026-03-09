// src/components/NotificationBell.jsx

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Bell, X, CheckCheck } from 'lucide-react';

const API = 'http://127.0.0.1:8000/api';

export default function NotificationBell({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Poll unread count every 30 seconds
  useEffect(() => {
    if (!userId) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API}/notifications/user/${userId}`);
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const handleOpen = async () => {
    setOpen(prev => !prev);
    if (!open) await fetchNotifications(); // refresh on open
  };

  const markRead = async (id) => {
    try {
      await axios.post(`${API}/notifications/${id}/mark-read`);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    } catch (err) {
      console.error('Error marking read:', err);
    }
  };

  const markAllRead = async () => {
    setLoading(true);
    try {
      await axios.post(`${API}/notifications/mark-all-read/${userId}`);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Error marking all read:', err);
    } finally {
      setLoading(false);
    }
  };

  const typeColor = (type) => ({
    danger:  { bg: '#fff5f5', border: '#f5c6cb', icon: '🔴' },
    warning: { bg: '#fffbf0', border: '#ffc107', icon: '🟡' },
    success: { bg: '#f0fff4', border: '#c3e6cb', icon: '🟢' },
    info:    { bg: '#f0f8ff', border: '#bee5eb', icon: '🔵' },
  }[type] || { bg: '#f8f9fa', border: '#dee2e6', icon: '⚪' });

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Bell Button */}
      <button
        onClick={handleOpen}
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#f0f0f0'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}
        title="Notifications"
      >
        <Bell size={22} color={open ? '#1976d2' : '#555'} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            backgroundColor: '#dc3545',
            color: 'white',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            fontSize: '11px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid white',
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: 'calc(100% + 8px)',
          width: '360px',
          maxHeight: '480px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          border: '1px solid #e9ecef',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e9ecef',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f8f9fa',
          }}>
            <div>
              <span style={{ fontWeight: '600', fontSize: '16px' }}>Notifications</span>
              {unreadCount > 0 && (
                <span style={{
                  marginLeft: '8px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '2px 8px',
                  fontSize: '12px',
                  fontWeight: '600',
                }}>
                  {unreadCount} new
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  disabled={loading}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#1976d2',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    borderRadius: '6px',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#e3f2fd'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <CheckCheck size={14} />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              >
                <X size={16} color="#888" />
              </button>
            </div>
          </div>

          {/* List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {notifications.length === 0 ? (
              <div style={{
                padding: '40px 20px',
                textAlign: 'center',
                color: '#888',
              }}>
                <Bell size={32} color="#ddd" style={{ marginBottom: '12px' }} />
                <p style={{ margin: 0, fontSize: '14px' }}>No notifications yet</p>
              </div>
            ) : (
              notifications.map(n => {
                const style = typeColor(n.type);
                return (
                  <div
                    key={n.id}
                    onClick={() => !n.is_read && markRead(n.id)}
                    style={{
                      padding: '14px 20px',
                      borderBottom: '1px solid #f0f0f0',
                      backgroundColor: n.is_read ? 'white' : style.bg,
                      borderLeft: n.is_read ? '4px solid transparent' : `4px solid ${style.border}`,
                      cursor: n.is_read ? 'default' : 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => {
                      if (!n.is_read) e.currentTarget.style.filter = 'brightness(0.97)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.filter = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <span>{style.icon}</span>
                          <span style={{ fontWeight: n.is_read ? '500' : '700', fontSize: '14px' }}>
                            {n.title}
                          </span>
                          {!n.is_read && (
                            <span style={{
                              width: '8px', height: '8px',
                              backgroundColor: '#dc3545',
                              borderRadius: '50%',
                              flexShrink: 0,
                            }} />
                          )}
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: '#555', lineHeight: '1.5' }}>
                          {n.message}
                        </p>
                      </div>
                    </div>
                    <div style={{ marginTop: '6px', fontSize: '11px', color: '#999' }}>
                      {formatTime(n.created_at)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}