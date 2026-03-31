import React from 'react';
import { Search } from 'lucide-react';

const NoResults = ({ searchTerm, selectedIndustry }) => {
  const getNoResultsMessage = () => {
    if (searchTerm && selectedIndustry !== 'all') {
      return `No companies found matching "${searchTerm}" in ${selectedIndustry}`;
    } else if (searchTerm) {
      return `No companies found matching "${searchTerm}"`;
    } else if (selectedIndustry !== 'all') {
      return `No companies found in ${selectedIndustry}`;
    }
    return 'No companies found';
  };

  return (
    <div className="no-results">
      <Search size={48} />
      <h3>No Results Found</h3>
      <p>{getNoResultsMessage()}</p>
      <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
        Try adjusting your search terms or filters
      </p>
    </div>
  );
};

export default NoResults;
