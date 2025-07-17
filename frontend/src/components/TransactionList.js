import React from 'react';

function TransactionList({ transactions, onEdit, onDelete, exceededCategories }) {
  return (
    <div className="mt-4">
      <h4>Transactions</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions && transactions.length > 0 ? (
            transactions.map((tx, idx) => {
              const catId = tx.category?._id || tx.category;
              const exceeded = exceededCategories && exceededCategories.includes(catId);
              return (
                <tr key={idx} className={exceeded ? 'table-danger' : ''}>
                  <td>{tx.date}</td>
                  <td>{tx.type}</td>
                  <td>{tx.category?.name || tx.category || '-'}</td>
                  <td>{tx.amount}</td>
                  <td>{tx.notes}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit && onEdit(tx)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => onDelete && onDelete(tx._id)}>Delete</button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr><td colSpan="6">No transactions found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionList; 