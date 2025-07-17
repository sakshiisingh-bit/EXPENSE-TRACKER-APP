import React, { useState, useEffect } from 'react';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import Filters from '../components/Filters';
import ExpensePieChart from '../components/ExpensePieChart';
import IncomeExpenseChart from '../components/IncomeExpenseChart';
import CategoryForm from '../components/CategoryForm';
import BudgetForm from '../components/BudgetForm';
import { useAuth } from '../context/AuthContext';
import { getTransactions, addTransaction, updateTransaction, getBudgets } from '../services/api';

function Dashboard() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', category: '', type: '', search: '', sort: '', budgetExceeded: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editTx, setEditTx] = useState(null);
  const [exceededCategories, setExceededCategories] = useState([]);

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [txs, buds] = await Promise.all([
        getTransactions(token),
        getBudgets(token)
      ]);
      setTransactions(txs);
      setBudgets(buds);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchAll();
    // eslint-disable-next-line
  }, [token]);

  const handleAdd = async (tx) => {
    setError('');
    try {
      const newTx = await addTransaction(tx, token);
      setTransactions([newTx, ...transactions]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await fetch(`http://localhost:3000/transactions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setTransactions(transactions.filter(tx => tx._id !== id));
    } catch (err) {
      setError('Failed to delete transaction');
    }
  };

  const handleEdit = (tx) => {
    setEditTx({ ...tx, category: tx.category?._id || tx.category });
  };

  const handleUpdate = async (updated) => {
    setError('');
    try {
      const newTx = await updateTransaction(editTx._id, updated, token);
      setTransactions(transactions.map(tx => tx._id === editTx._id ? newTx : tx));
      setEditTx(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => setEditTx(null);

  // Calculate exceeded categories for the current month
  useEffect(() => {
    if (!budgets.length || !transactions.length) {
      setExceededCategories([]);
      return;
    }
    const month = filters.startDate ? filters.startDate.slice(0, 7) : new Date().toISOString().slice(0, 7);
    const catTotals = {};
    transactions.forEach(tx => {
      if (tx.type === 'expense' && tx.date && tx.date.startsWith(month)) {
        const catId = tx.category?._id || tx.category;
        catTotals[catId] = (catTotals[catId] || 0) + Number(tx.amount);
      }
    });
    const exceeded = budgets.filter(bud => {
      return bud.timeInterval === 'monthly' && catTotals[bud.category?._id || bud.category] > bud.amount;
    }).map(bud => bud.category?._id || bud.category);
    setExceededCategories(exceeded);
  }, [budgets, transactions, filters.startDate]);

  // Filter, search, and sort transactions
  let filtered = transactions.filter(tx => {
    if (filters.type && tx.type !== filters.type) return false;
    if (filters.category && tx.category !== filters.category) return false;
    if (filters.startDate && tx.date < filters.startDate) return false;
    if (filters.endDate && tx.date > filters.endDate) return false;
    if (filters.search) {
      const search = filters.search.toLowerCase();
      const cat = tx.category?.name || tx.category || '';
      if (!tx.notes?.toLowerCase().includes(search) && !cat.toLowerCase().includes(search)) return false;
    }
    if (filters.budgetExceeded && !exceededCategories.includes(tx.category?._id || tx.category)) return false;
    return true;
  });
  if (filters.sort) {
    filtered = [...filtered].sort((a, b) => {
      switch (filters.sort) {
        case 'date_desc': return b.date.localeCompare(a.date);
        case 'date_asc': return a.date.localeCompare(b.date);
        case 'amount_desc': return b.amount - a.amount;
        case 'amount_asc': return a.amount - b.amount;
        case 'category_asc': return (a.category?.name || a.category || '').localeCompare(b.category?.name || b.category || '');
        case 'category_desc': return (b.category?.name || b.category || '').localeCompare(a.category?.name || a.category || '');
        default: return 0;
      }
    });
  }

  const month = filters.startDate ? filters.startDate.slice(0, 7) : new Date().toISOString().slice(0, 7);
  const monthTx = filtered.filter(tx => tx.date && tx.date.startsWith(month));
  const totalIncome = monthTx.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + Number(tx.amount), 0);
  const totalExpense = monthTx.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + Number(tx.amount), 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="container mt-5">
      <h2>Dashboard</h2>
      <div className="mb-3 d-flex flex-wrap gap-3">
        <CategoryForm onAdd={fetchAll} />
        <BudgetForm onAdd={fetchAll} />
      </div>
      {exceededCategories.length > 0 && (
        <div className="alert alert-danger">
          <strong>Budget Exceeded!</strong> You have exceeded your budget in: {exceededCategories.length} category(ies).
        </div>
      )}
      {editTx ? (
        <TransactionForm initialValues={editTx} onUpdate={handleUpdate} onCancel={handleCancel} />
      ) : (
        <TransactionForm onAdd={handleAdd} />
      )}
      <Filters filters={filters} setFilters={setFilters} />
      <div className="mb-3">
        <strong>Monthly Summary ({month}):</strong> Income: <span className="text-success">₹{totalIncome}</span> | Expense: <span className="text-danger">₹{totalExpense}</span> | Balance: <span className={balance >= 0 ? 'text-success' : 'text-danger'}>₹{balance}</span>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <ExpensePieChart data={filtered} exceededCategories={exceededCategories} />
          <IncomeExpenseChart data={filtered} />
          <TransactionList transactions={filtered} onEdit={handleEdit} onDelete={handleDelete} exceededCategories={exceededCategories} />
        </>
      )}
    </div>
  );
}

export default Dashboard; 