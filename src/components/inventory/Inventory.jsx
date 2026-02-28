import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdKitchen, MdEdit, MdDelete, MdRestaurantMenu } from 'react-icons/md';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5000/api';

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
      padding: window.innerWidth < 768 ? '15px' : '40px', 
      background: '#f8f9fa',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ 
        position: 'sticky',
        top: 0,
        background: '#f8f9fa',
        zIndex: 10,
        paddingBottom: '20px',
        marginBottom: '10px',
        borderBottom: '2px solid #e9ecef'
      }}>
      <div style={{ display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', justifyContent: 'space-between', alignItems: window.innerWidth < 768 ? 'flex-start' : 'center', gap: '15px' }}>
        <div>
          <h1 style={{ fontSize: window.innerWidth < 768 ? '24px' : '28px', fontWeight: '700', color: '#2d3436', margin: 0 }}><MdKitchen style={{ verticalAlign: 'middle' }} /> Inventory</h1>
          <p style={{ color: '#636e72', marginTop: '4px', fontSize: '13px' }}>Manage your kitchen ingredients</p>
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
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            width: window.innerWidth < 768 ? '100%' : 'auto'
          }}
        >
          + Add Item
        </motion.button>
      </div>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'white',
            padding: '30px',
            borderRadius: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            marginBottom: '30px',
            border: '1px solid #e9ecef'
          }}
        >
          <h3 style={{ marginTop: 0, color: '#2d3436', fontSize: window.innerWidth < 768 ? '16px' : '18px', fontWeight: '600' }}>{editingId ? <><MdEdit style={{ verticalAlign: 'middle' }} /> Edit Item</> : <>Add New Item</>}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '2fr 1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Item name (e.g., Flour)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                padding: '10px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              style={{
                padding: '10px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <select
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              style={{
                padding: '10px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
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
                padding: '10px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={{
                padding: '10px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
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
                padding: '8px 16px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px'
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
                padding: '8px 16px',
                background: '#e9ecef',
                color: '#495057',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 480 ? '1fr' : window.innerWidth < 768 ? 'repeat(auto-fill, minmax(280px, 1fr))' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {items.map((item) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -8, boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}
            transition={{ duration: 0.2 }}
            style={{
              background: 'white',
              padding: window.innerWidth < 768 ? '16px' : '24px',
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              display: 'flex',
              flexDirection: window.innerWidth < 480 ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: window.innerWidth < 480 ? 'flex-start' : 'center',
              border: '1px solid #e9ecef',
              gap: '12px'
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 8px 0', color: '#2d3436', fontSize: window.innerWidth < 768 ? '16px' : '18px', fontWeight: '600' }}>{item.name}</h3>
              <p style={{ margin: '0 0 6px 0', color: '#636e72', fontSize: '13px', fontWeight: '500' }}>
                {item.quantity} {item.unit} {item.price > 0 && `• ₹${item.price}`}
              </p>
              {item.category && <span style={{ fontSize: '12px', color: '#667eea', marginTop: '4px', display: 'inline-block', background: '#f0f0ff', padding: '3px 10px', borderRadius: '12px', fontWeight: '600' }}><MdRestaurantMenu style={{ verticalAlign: 'middle' }} /> {item.category}</span>}
            </div>
            <div style={{ display: 'flex', gap: '8px', width: window.innerWidth < 480 ? '100%' : 'auto' }}>
              <button
                onClick={() => editItem(item)}
                style={{
                  background: '#5f27cd',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '13px',
                  flex: window.innerWidth < 480 ? '1' : 'none'
                }}
              >
                <MdEdit /> Edit
              </button>
              <button
                onClick={() => deleteItem(item._id)}
                style={{
                  background: '#ff4757',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '13px',
                  flex: window.innerWidth < 480 ? '1' : 'none'
                }}
              >
                <MdDelete /> Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {items.length === 0 && !showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: '80px', background: 'white', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #e9ecef' }}
        >
          <div style={{ fontSize: '64px', marginBottom: '20px' }}><MdKitchen /></div>
          <p style={{ fontSize: '20px', color: '#2d3436', fontWeight: '600' }}>Your inventory is empty</p>
          <p style={{ fontSize: '14px', color: '#636e72', marginTop: '8px' }}>Click "Add Item" to start managing your ingredients!</p>
        </motion.div>
      )}
    </div>
  );
};

export default Inventory;
