import React from 'react';

const FilterDropdown = ({ selectedIndustry, setSelectedIndustry, industries, label = "Filter by Industry" }) => {
  return (
    <div className="filter-dropdown">
      <select 
        value={selectedIndustry} 
        onChange={(e) => setSelectedIndustry(e.target.value)}
        className="filter-select"
      >
        {industries.map(industry => (
          <option key={industry} value={industry}>
            {industry === 'all' ? 'All Industries' : industry}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterDropdown;
