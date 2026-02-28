import React, { useState, useEffect } from 'react';
import { MdRestaurantMenu, MdInventory, MdFactory, MdSettings } from 'react-icons/md';
import { BiLogOut } from 'react-icons/bi';
import Register from './components/Register';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Inventory from './components/inventory/Inventory';
import Recipes from './components/Recipes';
import RawMaterials from './components/RawMaterials';
import ChangePassword from './components/ChangePassword';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [showRegister, setShowRegister] = useState(false);
  const [activeTab, setActiveTab] = useState('inventory');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <div style={{ display: 'flex', height: '100vh', background: '#f5f5f5', flexDirection: 'column' }}>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {!isMobile && <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />}
        <div style={{ flex: 1, overflow: 'auto', paddingBottom: isMobile ? '80px' : '0' }}>
          {activeTab === 'inventory' && <Inventory />}
          {activeTab === 'recipes' && <Recipes />}
          {activeTab === 'rawmaterials' && <RawMaterials />}
          {activeTab === 'settings' && <ChangePassword />}
        </div>
      </div>
      {isMobile && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'white',
          display: 'flex',
          justifyContent: 'space-around',
          padding: '8px 0 12px 0',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
          zIndex: 1000,
          borderTop: '1px solid #e9ecef'
        }}>
          <div onClick={() => setActiveTab('recipes')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', flex: 1, padding: '4px' }}>
            <MdRestaurantMenu style={{ fontSize: '22px', color: activeTab === 'recipes' ? '#667eea' : '#95a5a6' }} />
            <span style={{ fontSize: '11px', color: activeTab === 'recipes' ? '#667eea' : '#95a5a6', fontWeight: activeTab === 'recipes' ? '600' : '400', marginTop: '2px' }}>Recipes</span>
          </div>
          <div onClick={() => setActiveTab('inventory')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', flex: 1, padding: '4px' }}>
            <MdInventory style={{ fontSize: '22px', color: activeTab === 'inventory' ? '#667eea' : '#95a5a6' }} />
            <span style={{ fontSize: '11px', color: activeTab === 'inventory' ? '#667eea' : '#95a5a6', fontWeight: activeTab === 'inventory' ? '600' : '400', marginTop: '2px' }}>Inventory</span>
          </div>
          <div onClick={() => setActiveTab('rawmaterials')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', flex: 1, padding: '4px' }}>
            <MdFactory style={{ fontSize: '22px', color: activeTab === 'rawmaterials' ? '#667eea' : '#95a5a6' }} />
            <span style={{ fontSize: '11px', color: activeTab === 'rawmaterials' ? '#667eea' : '#95a5a6', fontWeight: activeTab === 'rawmaterials' ? '600' : '400', marginTop: '2px' }}>Materials</span>
          </div>
          <div onClick={() => setActiveTab('settings')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', flex: 1, padding: '4px' }}>
            <MdSettings style={{ fontSize: '22px', color: activeTab === 'settings' ? '#667eea' : '#95a5a6' }} />
            <span style={{ fontSize: '11px', color: activeTab === 'settings' ? '#667eea' : '#95a5a6', fontWeight: activeTab === 'settings' ? '600' : '400', marginTop: '2px' }}>Settings</span>
          </div>
          <div onClick={handleLogout} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', flex: 1, padding: '4px' }}>
            <BiLogOut style={{ fontSize: '22px', color: '#95a5a6' }} />
            <span style={{ fontSize: '11px', color: '#95a5a6', marginTop: '2px' }}>Logout</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;