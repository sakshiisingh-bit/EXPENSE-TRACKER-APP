import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function CategoryForm({ onAdd }) {
  const { token } = useAuth();
  const [name, setName] = useState('');
  const [type, setType] = useState('expense');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('http://localhost:3000/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, type })
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to add category');
      setSuccess(true);
      setName('');
      setType('expense');
      onAdd && onAdd();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="mb-3" onSubmit={handleSubmit} style={{maxWidth: 400}}>
      <div className="input-group">
        <input type="text" className="form-control" placeholder="Category name" value={name} onChange={e => setName(e.target.value)} required />
        <select className="form-select" value={type} onChange={e => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <button className="btn btn-primary" type="submit">Add Category</button>
      </div>
      {error && <div className="alert alert-danger mt-2">{error}</div>}
      {success && <div className="alert alert-success mt-2">Category added!</div>}
    </form>
  );
}

export default CategoryForm; 