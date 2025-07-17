import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCategories } from '../services/api';

function BudgetForm({ onAdd }) {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [timeInterval, setTimeInterval] = useState('monthly');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories(token);
        setCategories(data);
      } catch (err) {
        setCategories([]);
      }
    }
    if (token) fetchCategories();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('http://localhost:3000/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ category, amount, timeInterval })
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to add budget');
      setSuccess(true);
      setCategory('');
      setAmount('');
      setTimeInterval('monthly');
      onAdd && onAdd();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="mb-3" onSubmit={handleSubmit} style={{maxWidth: 500}}>
      <div className="row g-2 align-items-center">
        <div className="col-md-5">
          <select className="form-select" value={category} onChange={e => setCategory(e.target.value)} required>
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name} ({cat.type})</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <input type="number" className="form-control" placeholder="Budget Amount" value={amount} onChange={e => setAmount(e.target.value)} required />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={timeInterval} onChange={e => setTimeInterval(e.target.value)}>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div className="col-md-1">
          <button className="btn btn-primary w-100" type="submit">Add Budget</button>
        </div>
      </div>
      {error && <div className="alert alert-danger mt-2">{error}</div>}
      {success && <div className="alert alert-success mt-2">Budget added!</div>}
    </form>
  );
}

export default BudgetForm; 