import React from 'react';

function Filters({ filters, setFilters }) {
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFilters({ ...filters, [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <div className="mb-3">
      <div className="row g-2 align-items-center">
        <div className="col-md-2">
          <input type="date" className="form-control" name="startDate" value={filters.startDate} onChange={handleChange} placeholder="Start Date" />
        </div>
        <div className="col-md-2">
          <input type="date" className="form-control" name="endDate" value={filters.endDate} onChange={handleChange} placeholder="End Date" />
        </div>
        <div className="col-md-2">
          <input type="text" className="form-control" name="category" value={filters.category} onChange={handleChange} placeholder="Category" />
        </div>
        <div className="col-md-2">
          <select className="form-select" name="type" value={filters.type} onChange={handleChange}>
            <option value="">All</option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div className="col-md-2">
          <input type="text" className="form-control" name="search" value={filters.search || ''} onChange={handleChange} placeholder="Search notes/category" />
        </div>
        <div className="col-md-2">
          <select className="form-select" name="sort" value={filters.sort || ''} onChange={handleChange}>
            <option value="">Sort By</option>
            <option value="date_desc">Date (Newest)</option>
            <option value="date_asc">Date (Oldest)</option>
            <option value="amount_desc">Amount (High-Low)</option>
            <option value="amount_asc">Amount (Low-High)</option>
            <option value="category_asc">Category (A-Z)</option>
            <option value="category_desc">Category (Z-A)</option>
          </select>
        </div>
        <div className="col-md-2 mt-2">
          <div className="form-check">
            <input className="form-check-input" type="checkbox" name="budgetExceeded" id="budgetExceeded" checked={filters.budgetExceeded || false} onChange={handleChange} />
            <label className="form-check-label" htmlFor="budgetExceeded">
              Budget Exceeded Only
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Filters; 