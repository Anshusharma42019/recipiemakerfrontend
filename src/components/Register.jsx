import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Register = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem('token', data.token);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{ 
          flex: 1, 
          backgroundImage: 'url(https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: window.innerWidth < 768 ? 'none' : 'block'
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />
      </motion.div>

      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: window.innerWidth < 768 ? '20px' : '40px'
        }}
      >
        <div style={{ width: '100%', maxWidth: '450px' }}>
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ marginBottom: window.innerWidth < 768 ? '25px' : '40px' }}
          >
            <h1 style={{ color: 'white', fontSize: window.innerWidth < 768 ? '28px' : '42px', fontWeight: '700', margin: '0 0 10px 0' }}>Create Account</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: window.innerWidth < 768 ? '14px' : '16px', margin: 0 }}>Join us and start cooking!</p>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ marginBottom: '18px' }}
            >
              <label style={{ display: 'block', marginBottom: '6px', color: 'white', fontWeight: '600', fontSize: '13px' }}>Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: 'none',
                  borderRadius: '10px', 
                  fontSize: '14px', 
                  outline: 'none',
                  background: 'rgba(255,255,255,0.9)',
                  boxSizing: 'border-box'
                }}
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ marginBottom: '18px' }}
            >
              <label style={{ display: 'block', marginBottom: '6px', color: 'white', fontWeight: '600', fontSize: '13px' }}>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: 'none',
                  borderRadius: '10px', 
                  fontSize: '14px', 
                  outline: 'none',
                  background: 'rgba(255,255,255,0.9)',
                  boxSizing: 'border-box'
                }}
                required
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{ marginBottom: '25px' }}
            >
              <label style={{ display: 'block', marginBottom: '6px', color: 'white', fontWeight: '600', fontSize: '13px' }}>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: 'none',
                  borderRadius: '10px', 
                  fontSize: '14px', 
                  outline: 'none',
                  background: 'rgba(255,255,255,0.9)',
                  boxSizing: 'border-box'
                }}
                required
              />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              type="submit"
              style={{ 
                width: '100%', 
                padding: '14px', 
                background: 'white',
                color: '#667eea', 
                border: 'none', 
                borderRadius: '10px', 
                fontSize: '15px', 
                fontWeight: '700', 
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
              }}
            >
              Register
            </motion.button>
          </form>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ color: '#ffcccc', marginTop: '15px', textAlign: 'center', fontSize: '13px', fontWeight: '500' }}
            >
              {error}
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
