import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', quantity: '', unit: '', category: '', price: '', minStock: '' });

  const getDefaultMinStock = (unit) => {
    const lowThresholds = {
      'kg': 1,
      'L': 1,
      'g': 50,
      'ml': 100,
      'pcs': 5,
      'dozen': 1,
      'cup': 2,
      'tbsp': 3,
      'tsp': 5
    };
    return lowThresholds[unit] || 10;
  };

  useEffect(() => {
    fetchItems();
    
    // Auto-refresh every 3 seconds
    const interval = setInterval(fetchItems, 3000);
    return () => clearInterval(interval);
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
      await fetch(`${API_URL}/inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      setFormData({ name: '', quantity: '', unit: '', category: '', price: '', minStock: '' });
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

  const isLowStock = (item) => {
    const minStock = item.minStock || getDefaultMinStock(item.unit);
    return item.quantity <= minStock;
  };

  const getDefaultMinStock = (unit) => {
    const lowThresholds = {
      'kg': 1,
      'L': 1,
      'g': 50,
      'ml': 100,
      'pcs': 5,
      'dozen': 1,
      'cup': 2,
      'tbsp': 3,
      'tsp': 5
    };
    return lowThresholds[unit] || 10;
  };

  const lowStockCount = items.filter(isLowStock).length;

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#2d3436', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            🍽️ Inventory
          </h1>
          {lowStockCount > 0 && (
            <p style={{ color: '#ff6348', fontSize: '14px', marginTop: '5px', fontWeight: '600' }}>⚠️ {lowStockCount} item{lowStockCount > 1 ? 's' : ''} low on stock</p>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #fd79a8 0%, #a29bfe 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
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
            background: 'white',
            padding: '30px',
            borderRadius: '15px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            marginBottom: '30px'
          }}
        >
          <h3 style={{ marginTop: 0, color: '#2d3436', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🥘 Add New Item
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
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
              onChange={(e) => {
                const unit = e.target.value;
                setFormData({ ...formData, unit, minStock: formData.minStock || getDefaultMinStock(unit) });
              }}
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
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="L">L</option>
              <option value="ml">ml</option>
              <option value="pcs">pcs</option>
              <option value="dozen">dozen</option>
              <option value="cup">cup</option>
              <option value="tbsp">tbsp</option>
              <option value="tsp">tsp</option>
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
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
              placeholder={`Min Stock (default: ${formData.unit ? getDefaultMinStock(formData.unit) : '10'})`}
              value={formData.minStock}
              onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
              style={{
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '15px',
                outline: 'none'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={addItem}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #fd79a8 0%, #a29bfe 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Add
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{
                padding: '10px 20px',
                background: '#e0e0e0',
                color: '#333',
                border: 'none',
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {items.map((item) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            style={{
              background: isLowStock(item) ? '#fff5f5' : 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              border: isLowStock(item) ? '2px solid #ff6348' : '2px solid transparent',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#2d3436', fontSize: '18px' }}>{item.name}</h3>
                {isLowStock(item) && <span style={{ fontSize: '16px' }}>⚠️</span>}
              </div>
              <p style={{ margin: 0, color: isLowStock(item) ? '#ff6348' : '#636e72', fontSize: '14px', fontWeight: isLowStock(item) ? '600' : 'normal' }}>
                {item.quantity} {item.unit} {item.price > 0 && `• ₹${item.price}`}
              </p>
              {item.category && <span style={{ fontSize: '12px', color: '#b2bec3', marginTop: '4px', display: 'block' }}>📦 {item.category}</span>}
              {isLowStock(item) && (
                <span style={{ fontSize: '12px', color: '#ff6348', marginTop: '4px', display: 'block' }}>Low stock! Min: {item.minStock || getDefaultMinStock(item.unit)}</span>
              )}
            </div>
            <button
              onClick={() => deleteItem(item._id)}
              style={{
                background: '#ff6348',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Delete
            </button>
          </motion.div>
        ))}
      </div>

      {items.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
          <p style={{ fontSize: '18px' }}>No items in inventory. Click "Add Item" to get started!</p>
        </div>
      )}
    </div>
  );
};

export default Inventory;
