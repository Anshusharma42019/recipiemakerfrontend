import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ChangePassword = () => {
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_MONGO_API}/api/auth/change-password`, {
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
      padding: '40px', 
      background: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1920&q=80) center/cover fixed',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          maxWidth: '450px',
          width: '100%',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <h2 style={{ color: 'white', fontSize: '28px', fontWeight: '700', marginBottom: '10px', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>⚙️ Settings</h2>
        <p style={{ color: 'white', marginBottom: '30px', fontSize: '14px', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>Change your account password</p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontWeight: '600', fontSize: '14px', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>Current Password</label>
            <input
              type="password"
              placeholder="Enter current password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontWeight: '600', fontSize: '14px', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                fontSize: '15px',
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
              padding: '14px', 
              background: 'rgba(102, 126, 234, 0.8)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '10px',
              fontSize: '16px',
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
            style={{ color: '#00b894', marginTop: '20px', textAlign: 'center', fontWeight: '600' }}
          >
            ✓ {message}
          </motion.p>
        )}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ color: '#ff4757', marginTop: '20px', textAlign: 'center', fontWeight: '600' }}
          >
            ✕ {error}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default ChangePassword;
