import React, { useState } from 'react';

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
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Current Password"
          value={formData.currentPassword}
          onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={formData.newPassword}
          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
          required
        />
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#ffc107', color: 'black', border: 'none', cursor: 'pointer' }}>
          Change Password
        </button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ChangePassword;
