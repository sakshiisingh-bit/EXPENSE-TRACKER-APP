const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export async function loginUser(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Login failed');
  return res.json();
}

export async function registerUser(name, email, password) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Register failed');
  return res.json();
}

export async function getTransactions(token) {
  const res = await fetch(`${API_URL}/transactions`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to fetch transactions');
  return res.json();
}

export async function addTransaction(data, token) {
  const res = await fetch(`${API_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to add transaction');
  return res.json();
}

export async function getCategories(token) {
  const res = await fetch(`${API_URL}/categories`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to fetch categories');
  return res.json();
}

export async function updateTransaction(id, data, token) {
  const res = await fetch(`${API_URL}/transactions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to update transaction');
  return res.json();
}

export async function getBudgets(token) {
  const res = await fetch(`${API_URL}/budgets`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to fetch budgets');
  return res.json();
} 