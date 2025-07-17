import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// A palette of distinct colors
const PALETTE = [
  '#007bff', // blue
  '#28a745', // green
  '#fd7e14', // orange
  '#6f42c1', // purple
  '#ffc107', // yellow
  '#20c997', // teal
  '#e83e8c', // pink
  '#343a40', // dark
  '#17a2b8', // cyan
  '#6610f2', // indigo
  '#ff6384', // light red
  '#36a2eb', // light blue
  '#ffce56', // light yellow
  '#4bc0c0', // light teal
  '#9966ff', // light purple
];

function ExpensePieChart({ data, exceededCategories }) {
  const categoryTotals = {};
  data.forEach(tx => {
    if (tx.type === 'expense') {
      const cat = tx.category?._id || tx.category;
      const catName = tx.category?.name || tx.category || 'Other';
      if (!categoryTotals[cat]) categoryTotals[cat] = { name: catName, total: 0 };
      categoryTotals[cat].total += Number(tx.amount);
    }
  });
  const catIds = Object.keys(categoryTotals);
  const labels = catIds.map(catId => categoryTotals[catId].name);
  const dataArr = catIds.map(catId => categoryTotals[catId].total);
  const backgroundColors = catIds.map((catId, idx) =>
    exceededCategories && exceededCategories.includes(catId)
      ? '#dc3545' // red for exceeded
      : PALETTE[idx % PALETTE.length]
  );
  const chartData = {
    labels,
    datasets: [
      {
        data: dataArr,
        backgroundColor: backgroundColors,
      },
    ],
  };

  return (
    <div className="mt-4">
      <h4>Expense Distribution by Category</h4>
      {labels.length === 0 ? (
        <div className="alert alert-info">No expense data to display.</div>
      ) : (
        <Pie data={chartData} />
      )}
    </div>
  );
}

export default ExpensePieChart; 