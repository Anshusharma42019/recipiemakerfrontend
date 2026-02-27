import React from 'react';
import { motion } from 'framer-motion';

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'recipes', label: 'Recipes', icon: '📖' },
    { id: 'inventory', label: 'Inventory', icon: '📦' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div style={{ width: '250px', background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)', height: '100vh', display: 'flex', flexDirection: 'column', boxShadow: '2px 0 10px rgba(0,0,0,0.1)' }}>
      <div style={{ padding: '30px 20px', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
        <h2 style={{ color: 'white', margin: 0, fontSize: '24px', fontWeight: '700' }}>Recipe Maker</h2>
      </div>
      
      <div style={{ flex: 1, padding: '20px 0' }}>
        {menuItems.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ x: 5 }}
            onClick={() => setActiveTab(item.id)}
            style={{
              padding: '15px 20px',
              margin: '5px 10px',
              borderRadius: '10px',
              cursor: 'pointer',
              background: activeTab === item.id ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              fontSize: '16px',
              fontWeight: activeTab === item.id ? '600' : '400',
              transition: 'all 0.3s'
            }}
          >
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            {item.label}
          </motion.div>
        ))}
      </div>
      
      <div style={{ padding: '20px' }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onLogout}
          style={{
            width: '100%',
            padding: '12px',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Logout
        </motion.button>
      </div>
    </div>
  );
};

export default Sidebar;
