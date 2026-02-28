import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const RawMaterials = () => {
  const [items, setItems] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ recipeName: '', variation: '', ingredients: [{ inventoryId: '', quantity: '' }] });

  useEffect(() => {
    fetchItems();
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    const res = await fetch(`${API_URL}/inventory`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    setInventoryItems(data);
  };

  const fetchItems = async () => {
    const res = await fetch(`${API_URL}/rawmaterials`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    setItems(data);
  };

  const addIngredient = () => {
    setFormData({ ...formData, ingredients: [...formData.ingredients, { inventoryId: '', quantity: '' }] });
  };

  const removeIngredient = (index) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const updateIngredient = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index][field] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addItem = async () => {
    if (formData.recipeName && formData.ingredients.every(ing => ing.inventoryId && ing.quantity)) {
      const url = editingId ? `${API_URL}/rawmaterials/${editingId}` : `${API_URL}/rawmaterials`;
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) {
        const error = await res.json();
        alert(error.message || 'Failed to save recipe');
        return;
      }
      
      setFormData({ recipeName: '', variation: '', ingredients: [{ inventoryId: '', quantity: '' }] });
      setEditingId(null);
      setShowForm(false);
      fetchItems();
    }
  };

  const deleteItem = async (id) => {
    await fetch(`${API_URL}/rawmaterials/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    fetchItems();
  };

  const editItem = (item) => {
    setFormData({
      recipeName: item.recipeName,
      variation: item.variation || '',
      ingredients: item.ingredients.map(ing => ({
        inventoryId: ing.inventoryId._id,
        quantity: ing.quantity
      }))
    });
    setEditingId(item._id);
    setShowForm(true);
  };

  const isLowStock = (ingredient) => {
    const minStock = ingredient.inventoryId?.minStock || 10;
    return ingredient.inventoryId?.quantity <= minStock;
  };

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#2d3436', margin: 0 }}>
          📦 Raw Materials
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ recipeName: '', variation: '', ingredients: [{ inventoryId: '', quantity: '' }] });
          }}
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
          + Add Recipe
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
          <h3 style={{ marginTop: 0, color: '#2d3436' }}>{editingId ? '✏️ Edit Recipe' : '🍕 Add New Recipe'}</h3>
          <input
            type="text"
            placeholder="Recipe name (e.g., Pizza)"
            value={formData.recipeName}
            onChange={(e) => setFormData({ ...formData, recipeName: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '15px',
              outline: 'none',
              marginBottom: '10px'
            }}
          />
          <input
            type="text"
            placeholder="Variation (optional, e.g., Margherita)"
            value={formData.variation}
            onChange={(e) => setFormData({ ...formData, variation: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '15px',
              outline: 'none',
              marginBottom: '20px'
            }}
          />
          
          <h4 style={{ color: '#2d3436', marginBottom: '15px' }}>Ingredients:</h4>
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '10px', marginBottom: '10px' }}>
              <select
                value={ingredient.inventoryId}
                onChange={(e) => updateIngredient(index, 'inventoryId', e.target.value)}
                style={{
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '15px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="">Select Ingredient</option>
                {inventoryItems.map(inv => (
                  <option key={inv._id} value={inv._id}>{inv.name} ({inv.quantity} {inv.unit})</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Quantity"
                value={ingredient.quantity}
                onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                style={{
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '15px',
                  outline: 'none'
                }}
              />
              {formData.ingredients.length > 1 && (
                <button
                  onClick={() => removeIngredient(index)}
                  style={{
                    padding: '12px',
                    background: '#ff6348',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          
          <button
            onClick={addIngredient}
            style={{
              padding: '10px 20px',
              background: '#74b9ff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              marginTop: '10px',
              marginBottom: '20px'
            }}
          >
            + Add Ingredient
          </button>

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
              {editingId ? 'Update Recipe' : 'Save Recipe'}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData({ recipeName: '', variation: '', ingredients: [{ inventoryId: '', quantity: '' }] });
              }}
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {items.map((item) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              border: '2px solid #e0e0e0'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#2d3436', fontSize: '20px' }}>🍕 {item.recipeName}</h3>
                {item.variation && <p style={{ margin: '4px 0 0 0', color: '#636e72', fontSize: '14px' }}>{item.variation}</p>}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => editItem(item)}
                  style={{
                    background: '#74b9ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '12px'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteItem(item._id)}
                  style={{
                    background: '#ff6348',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '12px'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
            
            <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '10px' }}>
              <p style={{ fontSize: '13px', color: '#636e72', fontWeight: '600', marginBottom: '8px' }}>Ingredients:</p>
              {item.ingredients?.map((ing, idx) => (
                <div key={idx} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '6px 0',
                  borderBottom: idx < item.ingredients.length - 1 ? '1px solid #f0f0f0' : 'none'
                }}>
                  <span style={{ fontSize: '14px', color: '#2d3436' }}>
                    {isLowStock(ing) && '⚠️ '}
                    {ing.inventoryId?.name}
                  </span>
                  <span style={{ fontSize: '14px', color: isLowStock(ing) ? '#ff6348' : '#636e72', fontWeight: '600' }}>
                    {ing.quantity} {ing.inventoryId?.unit}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {items.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
          <p style={{ fontSize: '18px' }}>No recipes. Click "Add Recipe" to get started!</p>
        </div>
      )}
    </div>
  );
};

export default RawMaterials;
