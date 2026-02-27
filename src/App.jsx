import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Inventory from './components/inventory/Inventory';
import ChangePassword from './components/ChangePassword';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [showRegister, setShowRegister] = useState(false);
  const [activeTab, setActiveTab] = useState('inventory');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div>
        {showRegister ? (
          <>
            <Register onSuccess={() => setIsLoggedIn(true)} />
            <p style={{ position: 'absolute', bottom: '30px', right: '50%', transform: 'translateX(50%)', color: 'white', zIndex: 10 }}>
              Already have an account? <button onClick={() => setShowRegister(false)} style={{ background: 'white', border: 'none', color: '#667eea', cursor: 'pointer', padding: '8px 20px', borderRadius: '8px', fontWeight: '600', marginLeft: '10px' }}>Login</button>
            </p>
          </>
        ) : (
          <>
            <Login onSuccess={() => setIsLoggedIn(true)} />
            <p style={{ position: 'absolute', bottom: '30px', right: '50%', transform: 'translateX(50%)', color: 'white', zIndex: 10 }}>
              Don't have an account? <button onClick={() => setShowRegister(true)} style={{ background: 'white', border: 'none', color: '#667eea', cursor: 'pointer', padding: '8px 20px', borderRadius: '8px', fontWeight: '600', marginLeft: '10px' }}>Register</button>
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f5f5f5' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <div style={{ flex: 1, overflow: 'auto' }}>
        {activeTab === 'inventory' && <Inventory />}
        {activeTab === 'recipes' && <div style={{ padding: '40px' }}><h1>Recipes Coming Soon</h1></div>}
        {activeTab === 'settings' && <ChangePassword />}
      </div>
    </div>
  );
};

export default App;