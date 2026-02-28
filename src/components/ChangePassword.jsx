import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MdSettings, MdLock } from 'react-icons/md';

const ChangePassword = () => {
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/change-password`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setMessage('Password changed successfully');
      setError('');
      setFormData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.message || 'Failed to change password');
      setMessage('');
    }
  };

  return (
    <div style={{ 
      padding: window.innerWidth < 768 ? '15px' : '40px', 
      background: '#f8f9fa',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ 
        position: 'fixed',
        top: 0,
        left: window.innerWidth < 768 ? 0 : '250px',
        right: 0,
        background: '#f8f9fa',
        zIndex: 10,
        padding: window.innerWidth < 768 ? '15px' : '20px 40px',
        borderBottom: '2px solid #e9ecef'
      }}>
        <div style={{ display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', justifyContent: 'space-between', alignItems: window.innerWidth < 768 ? 'flex-start' : 'center', gap: '15px' }}>
          <div>
            <h1 style={{ fontSize: window.innerWidth < 768 ? '24px' : '28px', fontWeight: '700', color: '#2d3436', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MdSettings style={{ fontSize: window.innerWidth < 768 ? '24px' : '28px' }} /> Settings
            </h1>
            <p style={{ color: '#636e72', marginTop: '4px', fontSize: '13px' }}>Manage your account settings</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: window.innerWidth < 768 ? '130px' : '120px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'white',
            padding: '30px',
            borderRadius: '15px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            maxWidth: '450px',
            width: '100%',
            border: '1px solid #e9ecef'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <MdLock style={{ fontSize: '48px', color: '#667eea', marginBottom: '10px' }} />
            <h2 style={{ color: '#2d3436', fontSize: '22px', fontWeight: '600', marginBottom: '8px' }}>Change Password</h2>
            <p style={{ color: '#636e72', fontSize: '13px' }}>Update your account password</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: '#2d3436', fontWeight: '600', fontSize: '13px' }}>Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: '#2d3436', fontWeight: '600', fontSize: '13px' }}>New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              style={{ 
                width: '100%', 
                padding: '12px', 
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Change Password
            </motion.button>
          </form>
          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ color: '#00b894', marginTop: '15px', textAlign: 'center', fontWeight: '600', fontSize: '13px' }}
            >
              ✓ {message}
            </motion.p>
          )}
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ color: '#ff4757', marginTop: '15px', textAlign: 'center', fontWeight: '600', fontSize: '13px' }}
            >
              ✕ {error}
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ChangePassword;
