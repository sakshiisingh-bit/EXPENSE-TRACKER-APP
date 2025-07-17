import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function IncomeExpenseChart({ data }) {
  const income = data.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + Number(tx.amount), 0);
  const expense = data.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + Number(tx.amount), 0);

  const chartData = {
    labels: ['Income', 'Expense'],
    datasets: [
      {
        label: 'Amount',
        data: [income, expense],
        backgroundColor: ['#28a745', '#dc3545'],
      },
    ],
  };

  return (
    <div className="mt-4">
      <h4>Income vs Expense Breakdown</h4>
      {(income === 0 && expense === 0) ? (
        <div className="alert alert-info">No data to display.</div>
      ) : (
        <Bar data={chartData} />
      )}
    </div>
  );
}

export default IncomeExpenseChart; 