import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdRestaurant, MdPerson, MdTimer, MdRestaurantMenu, MdClose, MdAdd, MdDelete } from 'react-icons/md';
import { GiCookingPot } from 'react-icons/gi';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5000/api';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [cookingRecipe, setCookingRecipe] = useState(null);
  const [formData, setFormData] = useState({ title: '', instructions: '', cookTime: '', servings: '', ingredients: [] });

  useEffect(() => {
    fetchRecipes();
    fetchInventory();
    fetchRawMaterials();
  }, []);

  const fetchRawMaterials = async () => {
    const res = await fetch(`${API_URL}/rawmaterials`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    setRawMaterials(data);
  };

  const fetchRecipes = async () => {
    const res = await fetch(`${API_URL}/recipes`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    setRecipes(data);
  };

  const fetchInventory = async () => {
    const res = await fetch(`${API_URL}/inventory`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    setInventory(data);
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { inventoryId: '', quantity: '', unit: '' }]
    });
  };

  const updateIngredient = (index, field, value) => {
    const updated = [...formData.ingredients];
    updated[index][field] = value;
    if (field === 'inventoryId') {
      const item = inventory.find(i => i._id === value);
      if (item) updated[index].unit = item.unit;
    }
    setFormData({ ...formData, ingredients: updated });
  };

  const removeIngredient = (index) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index)
    });
  };

  const createRecipe = async () => {
    if (formData.title && formData.ingredients.length > 0) {
      await fetch(`${API_URL}/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      setFormData({ title: '', instructions: '', cookTime: '', servings: '', ingredients: [] });
      setShowForm(false);
      fetchRecipes();
      fetchInventory();
    }
  };

  const canCookRecipe = (recipe) => {
    return recipe.ingredients?.every(ing => {
      const invItem = inventory.find(i => i._id === ing.inventoryId?._id);
      return invItem && invItem.quantity >= ing.quantity;
    });
  };

  const cookRecipe = async (id) => {
    try {
      setCookingRecipe(id);
      const res = await fetch(`${API_URL}/recipes/${id}/cook`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      });
      const data = await res.json();
      if (res.ok) {
        alert('Recipe cooked successfully! Ingredients deducted from inventory.');
        await fetchRecipes();
        await fetchInventory();
      } else {
        alert(data.error || 'Failed to cook recipe');
      }
    } catch (error) {
      alert('Error cooking recipe: ' + error.message);
    } finally {
      setCookingRecipe(null);
    }
  };

  const deleteRecipe = async (id) => {
    await fetch(`${API_URL}/recipes/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    fetchRecipes();
  };

  return (
    <div style={{ 
      padding: '15px', 
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#2d3436', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MdRestaurant /> Recipes
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #55efc4 0%, #81ecec 100%)',
            color: '#2d3436',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          + Add Recipe
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
            borderRadius: '15px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            marginBottom: '30px',
            border: '1px solid #e9ecef'
          }}
        >
          <h3 style={{ marginTop: 0, color: '#2d3436', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: '600' }}>
            <MdPerson /> Create New Recipe
          </h3>
          
          {rawMaterials.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#2d3436', fontSize: '14px', marginBottom: '8px', display: 'block' }}>Select from Raw Materials:</label>
              <select
                onChange={(e) => {
                  const rm = rawMaterials.find(r => r._id === e.target.value);
                  if (rm) {
                    setFormData({ 
                      ...formData, 
                      title: rm.recipeName,
                      ingredients: rm.ingredients.map(ing => ({
                        inventoryId: ing.inventoryId._id,
                        quantity: ing.quantity,
                        unit: ing.inventoryId.unit
                      }))
                    });
                  }
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '15px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="">-- Or select a raw material recipe --</option>
                {rawMaterials.map(rm => (
                  <option key={rm._id} value={rm._id}>{rm.recipeName}</option>
                ))}
              </select>
            </div>
          )}
          
          <input
            type="text"
            placeholder="Recipe Title (e.g., Daal)"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '15px',
              marginBottom: '15px',
              outline: 'none'
            }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <input
              type="number"
              placeholder="Cook Time (minutes)"
              value={formData.cookTime}
              onChange={(e) => setFormData({ ...formData, cookTime: e.target.value })}
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
              placeholder="Servings"
              value={formData.servings}
              onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
              style={{
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '15px',
                outline: 'none'
              }}
            />
          </div>
          <textarea
            placeholder="Instructions"
            value={formData.instructions}
            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '15px',
              marginBottom: '15px',
              minHeight: '80px',
              outline: 'none'
            }}
          />

          <h4 style={{ color: '#2d3436', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MdRestaurantMenu /> Ingredients
          </h4>
          {formData.ingredients.map((ing, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '10px', marginBottom: '10px' }}>
              <select
                value={ing.inventoryId}
                onChange={(e) => updateIngredient(idx, 'inventoryId', e.target.value)}
                style={{
                  padding: '10px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                <option value="">Select Ingredient</option>
                {inventory.map(item => (
                  <option key={item._id} value={item._id}>{item.name} ({item.quantity} {item.unit})</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Quantity"
                value={ing.quantity}
                onChange={(e) => updateIngredient(idx, 'quantity', e.target.value)}
                style={{
                  padding: '10px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <input
                type="text"
                placeholder="Unit"
                value={ing.unit}
                onChange={(e) => updateIngredient(idx, 'unit', e.target.value)}
                style={{
                  padding: '10px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <button
                onClick={() => removeIngredient(idx)}
                style={{
                  padding: '10px 15px',
                  background: '#ff4757',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                <MdClose />
              </button>
            </div>
          ))}
            <button
              onClick={addIngredient}
              style={{
                padding: '10px 20px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                marginBottom: '20px',
                fontWeight: '600'
              }}
            >
              <MdAdd /> Add Ingredient
            </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={createRecipe}
              style={{
                padding: '10px 20px',
                background: '#55efc4',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Create Recipe
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{
                padding: '10px 20px',
                background: '#e9ecef',
                color: '#495057',
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 350px), 1fr))', gap: '15px' }}>
        {recipes.map((recipe) => (
          <motion.div
            key={recipe._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            style={{
              background: 'white',
              padding: window.innerWidth < 768 ? '16px' : '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid #e9ecef'
            }}
          >
            <h3 style={{ margin: '0 0 12px 0', color: '#2d3436', fontSize: '16px', fontWeight: '600' }}>
              <MdRestaurantMenu style={{ verticalAlign: 'middle' }} /> {recipe.title}
            </h3>
            
            <div style={{ marginBottom: '12px', background: '#f8f9fa', padding: '12px', borderRadius: '8px' }}>
              <strong style={{ color: '#2d3436', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <MdRestaurantMenu /> Ingredients:
              </strong>
              <ul style={{ margin: '5px 0', paddingLeft: '20px', color: '#495057', fontSize: '13px' }}>
                {recipe.ingredients?.map((ing, idx) => {
                  const invItem = inventory.find(i => i._id === ing.inventoryId?._id);
                  const hasEnough = invItem && invItem.quantity >= ing.quantity;
                  return (
                    <li key={idx} style={{ color: '#00b894', fontWeight: hasEnough ? 'normal' : '600' }}>
                      {ing.inventoryId?.name || 'Unknown'} - {ing.quantity} {ing.unit}
                      {!hasEnough && ` ⚠️ (only ${invItem?.quantity || 0} available)`}
                    </li>
                  );
                })}
              </ul>
            </div>

            {recipe.instructions && (
              <p style={{ color: '#495057', fontSize: '13px', marginBottom: '10px', background: '#f8f9fa', padding: '8px', borderRadius: '8px' }}>
                <strong style={{ color: '#2d3436' }}>Instructions:</strong> {recipe.instructions}
              </p>
            )}

            <div style={{ display: 'flex', gap: '10px', fontSize: '12px', color: '#636e72', marginBottom: '12px', fontWeight: '600' }}>
              {recipe.cookTime && <span><MdTimer style={{ verticalAlign: 'middle' }} /> {recipe.cookTime} min</span>}
              {recipe.servings && <span>{recipe.servings} servings</span>}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => cookRecipe(recipe._id)}
                disabled={!canCookRecipe(recipe) || cookingRecipe === recipe._id}
                style={{
                  flex: 1,
                  padding: '8px',
                  background: canCookRecipe(recipe) && cookingRecipe !== recipe._id ? '#00b894' : '#95a5a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: canCookRecipe(recipe) && cookingRecipe !== recipe._id ? 'pointer' : 'not-allowed',
                  fontWeight: '600',
                  fontSize: '13px',
                  opacity: canCookRecipe(recipe) && cookingRecipe !== recipe._id ? 1 : 0.5,
                  pointerEvents: canCookRecipe(recipe) && cookingRecipe !== recipe._id ? 'auto' : 'none'
                }}
              >
                {cookingRecipe === recipe._id ? <><GiCookingPot /> Cooking...</> : <><GiCookingPot /> Cook {!canCookRecipe(recipe) ? '(Not enough ingredients)' : ''}</>}
              </button>
              <button
                onClick={() => deleteRecipe(recipe._id)}
                style={{
                  padding: '8px 12px',
                  background: '#ff4757',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '13px'
                }}
              >
                <MdDelete /> Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {recipes.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#636e72' }}>
          <p style={{ fontSize: '18px' }}>No recipes yet. Click "Add Recipe" to create one!</p>
        </div>
      )}
    </div>
  );
};

export default Recipes;
