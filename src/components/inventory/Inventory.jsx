import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', quantity: '', unit: '', category: '', price: '' });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await fetch(`${API_URL}/inventory`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    setItems(data);
  };

  const addItem = async () => {
    if (formData.name && formData.quantity && formData.unit) {
      const url = editingId ? `${API_URL}/inventory/${editingId}` : `${API_URL}/inventory`;
      const method = editingId ? 'PUT' : 'POST';
      
      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      setFormData({ name: '', quantity: '', unit: '', category: '', price: '' });
      setEditingId(null);
      setShowForm(false);
      fetchItems();
    }
  };

  const deleteItem = async (id) => {
    await fetch(`${API_URL}/inventory/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    fetchItems();
  };

  const editItem = (item) => {
    setFormData({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      category: item.category || '',
      price: item.price || ''
    });
    setEditingId(item._id);
    setShowForm(true);
  };

  return (
    <div style={{ 
      padding: window.innerWidth < 768 ? '20px' : '40px', 
      background: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1920&q=80) center/cover fixed',
      minHeight: '100vh' 
    }}>
      <div style={{ display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', justifyContent: 'space-between', alignItems: window.innerWidth < 768 ? 'flex-start' : 'center', marginBottom: '30px', gap: '15px' }}>
        <div>
          <h1 style={{ fontSize: window.innerWidth < 768 ? '28px' : '36px', fontWeight: '800', color: 'white', margin: 0 }}>🍳 Inventory</h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginTop: '8px', fontSize: window.innerWidth < 768 ? '12px' : '14px' }}>Manage your kitchen ingredients</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ name: '', quantity: '', unit: '', category: '', price: '' });
          }}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: window.innerWidth < 768 ? '14px' : '16px',
            fontWeight: '600',
            cursor: 'pointer',
            width: window.innerWidth < 768 ? '100%' : 'auto'
          }}
        >
          + Add Item
        </motion.button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            padding: '30px',
            borderRadius: '20px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            marginBottom: '30px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <h3 style={{ marginTop: 0, color: 'white', fontSize: window.innerWidth < 768 ? '18px' : '20px', fontWeight: '700' }}>{editingId ? '✏️ Edit Item' : '✨ Add New Item'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '2fr 1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Item name (e.g., Flour)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '15px',
                outline: 'none'
              }}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              style={{
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '15px',
                outline: 'none'
              }}
            />
            <select
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              style={{
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '15px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="">Select Unit</option>
              <option value="PCS">PCS</option>
              <option value="KG">KG</option>
              <option value="Gram">Gram</option>
              <option value="Liter">Liter</option>
              <option value="Meter">Meter</option>
              <option value="Box">Box</option>
              <option value="Pack">Pack</option>
              <option value="Dozen">Dozen</option>
              <option value="Carton">Carton</option>
              <option value="Set">Set</option>
              <option value="Pair">Pair</option>
            </select>
            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              style={{
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '15px',
                outline: 'none'
              }}
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={{
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '15px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="">Select Category</option>
              <option value="Dairy">Dairy</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Meat">Meat</option>
              <option value="Seafood">Seafood</option>
              <option value="Grains">Grains</option>
              <option value="Baking">Baking</option>
              <option value="Spices">Spices</option>
              <option value="Sauces">Sauces</option>
              <option value="Oils">Oils</option>
              <option value="Beverages">Beverages</option>
              <option value="Snacks">Snacks</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={addItem}
              style={{
                padding: '10px 20px',
                background: 'rgba(102, 126, 234, 0.8)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              {editingId ? 'Update' : 'Add'}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData({ name: '', quantity: '', unit: '', category: '', price: '' });
              }}
              style={{
                padding: '10px 20px',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 480 ? '1fr' : window.innerWidth < 768 ? 'repeat(auto-fill, minmax(250px, 1fr))' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {items.map((item) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -8, boxShadow: '0 12px 30px rgba(102, 126, 234, 0.3)' }}
            transition={{ duration: 0.2 }}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              padding: window.innerWidth < 768 ? '16px' : '24px',
              borderRadius: '16px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: window.innerWidth < 480 ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: window.innerWidth < 480 ? 'flex-start' : 'center',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              gap: '12px'
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 10px 0', color: 'white', fontSize: window.innerWidth < 768 ? '18px' : '20px', fontWeight: '700', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>{item.name}</h3>
              <p style={{ margin: '0 0 6px 0', color: 'white', fontSize: window.innerWidth < 768 ? '14px' : '15px', fontWeight: '600', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)' }}>
                {item.quantity} {item.unit} {item.price > 0 && `• $${item.price}`}
              </p>
              {item.category && <span style={{ fontSize: '13px', color: 'white', marginTop: '4px', display: 'inline-block', background: 'rgba(255, 255, 255, 0.25)', padding: '4px 12px', borderRadius: '20px', fontWeight: '600', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)' }}>📦 {item.category}</span>}
            </div>
            <div style={{ display: 'flex', gap: '8px', width: window.innerWidth < 480 ? '100%' : 'auto' }}>
              <button
                onClick={() => editItem(item)}
                style={{
                  background: '#5f27cd',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  flex: window.innerWidth < 480 ? '1' : 'none'
                }}
              >
                Edit
              </button>
              <button
                onClick={() => deleteItem(item._id)}
                style={{
                  background: '#ff4757',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  flex: window.innerWidth < 480 ? '1' : 'none'
                }}
              >
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {items.length === 0 && !showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: '80px', background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
        >
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🍽️</div>
          <p style={{ fontSize: '20px', color: 'white', fontWeight: '600' }}>Your inventory is empty</p>
          <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', marginTop: '8px' }}>Click "Add Item" to start managing your ingredients!</p>
        </motion.div>
      )}
    </div>
  );
};

export default Inventory;
