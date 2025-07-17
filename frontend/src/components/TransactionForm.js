import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCategories } from '../services/api';

function TransactionForm({ onAdd, initialValues, onUpdate, onCancel }) {
  const { token } = useAuth();
  const [form, setForm] = useState(initialValues || {
    date: '',
    type: 'expense',
    category: '',
    amount: '',
    notes: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(initialValues || {
      date: '', type: 'expense', category: '', amount: '', notes: ''
    });
  }, [initialValues]);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      setError('');
      try {
        const data = await getCategories(token);
        setCategories(data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    }
    if (token) fetchCategories();
  }, [token]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (onUpdate) {
      onUpdate(form);
    } else if (onAdd) {
      onAdd(form);
      setForm({ date: '', type: 'expense', category: '', amount: '', notes: '' });
    }
  };

  return (
    <form className="mb-4" onSubmit={handleSubmit}>
      <div className="row g-2">
        <div className="col-md-2">
          <input type="date" className="form-control" name="date" value={form.date} onChange={handleChange} required />
        </div>
        <div className="col-md-2">
          <select className="form-select" name="type" value={form.type} onChange={handleChange}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" name="category" value={form.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.filter(cat => cat.type === form.type).map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <input type="number" className="form-control" name="amount" value={form.amount} onChange={handleChange} placeholder="Amount" required />
        </div>
        <div className="col-md-2">
          <input type="text" className="form-control" name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" />
        </div>
        <div className="col-md-1 d-flex align-items-center">
          <button type="submit" className="btn btn-success w-100" disabled={loading || !categories.length}>{onUpdate ? 'Update' : 'Add'}</button>
          {onUpdate && <button type="button" className="btn btn-secondary ms-2" onClick={onCancel}>Cancel</button>}
        </div>
      </div>
      {error && <div className="alert alert-danger mt-2">{error}</div>}
    </form>
  );
}

export default TransactionForm; 