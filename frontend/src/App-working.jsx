import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Brain, Database, Search, Grid, List, Calendar, ArrowUpRight, AlertTriangle } from 'lucide-react';
import SearchBar from './components/SearchBar';
import FilterDropdown from './components/FilterDropdown';
import NoResults from './components/NoResults';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

function App() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    filterAndSortClients();
  }, [clients, searchTerm, selectedIndustry, sortBy, sortOrder]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/clients`);
      setClients(response.data.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch clients. Please ensure backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortClients = () => {
    let filtered = [...clients];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.overview.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Industry filter
    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(client => client.industry === selectedIndustry);
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'name' || sortBy === 'industry') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredClients(filtered);
  };

  const fetchClientDetails = async (clientId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/clients/${clientId}`);
      setSelectedClient(response.data.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch client details.');
    } finally {
      setLoading(false);
    }
  };

  const seedDatabase = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/clients/seed`);
      await fetchClients();
      alert('Database seeded successfully!');
    } catch (error) {
      setError('Failed to seed database.');
    } finally {
      setLoading(false);
    }
  };

  const getIndustries = () => {
    const industries = [...new Set(clients.map(client => client.industry))];
    return ['all', ...industries];
  };

  if (loading && !selectedClient) {
    return (
      <div className="app-loading">
        <div className="loading-container">
          <div className="spinner"></div>
          <h2>Loading SaaS Intelligence Platform...</h2>
          <p>Initializing decision-support system</p>
        </div>
      </div>
    );
  }

  if (selectedClient) {
    return (
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <div className="header-brand">
              <Brain className="brand-icon" size={32} />
              <div>
                <h1>SaaS Intelligence</h1>
                <p>Decision-Support Platform</p>
              </div>
            </div>
            <button 
              className="back-btn"
              onClick={() => setSelectedClient(null)}
            >
              ← Back to List
            </button>
          </div>
        </header>
        
        <main className="app-main">
          <div className="client-detail-container">
            <h2>{selectedClient.client.name}</h2>
            <p>{selectedClient.client.overview}</p>
            <span className="industry-badge">{selectedClient.client.industry}</span>
            
            {selectedClient.intelligence && (
              <div className="intelligence-section">
                <h3>Intelligence Analysis</h3>
                <p><strong>Positioning:</strong> {selectedClient.intelligence.positioning}</p>
                <p><strong>Verdict:</strong> {selectedClient.intelligence.verdict}</p>
                <p><strong>Summary:</strong> {selectedClient.intelligence.summary}</p>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-brand">
            <Brain className="brand-icon" size={32} />
            <div>
              <h1>SaaS Intelligence</h1>
              <p>Decision-Support Platform</p>
            </div>
          </div>
          <button className="btn btn-primary" onClick={seedDatabase}>
            <Database size={20} />
            Seed Data
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="client-list-container">
          {/* Search and Filters */}
          <div className="search-filters">
            <SearchBar 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Search companies, industries, or keywords..."
            />
            
            <div className="filter-controls">
              <FilterDropdown 
                selectedIndustry={selectedIndustry}
                setSelectedIndustry={setSelectedIndustry}
                industries={getIndustries()}
              />
              
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="created_at">Latest</option>
                <option value="name">Name</option>
                <option value="industry">Industry</option>
                <option value="offering_count">Offerings</option>
              </select>
              
              <div className="view-toggle">
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid size={20} />
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <AlertTriangle size={20} />
              {error}
            </div>
          )}

          {/* No Results */}
          {filteredClients.length === 0 && !loading && (
            <NoResults searchTerm={searchTerm} selectedIndustry={selectedIndustry} />
          )}

          {/* Client List */}
          <div className={`client-container ${viewMode}`}>
            {filteredClients.map(client => (
              <div 
                key={client.id} 
                className="client-card"
                onClick={() => fetchClientDetails(client.id)}
              >
                <div className="client-header">
                  <h3>{client.name}</h3>
                  <span className="industry-badge">{client.industry}</span>
                </div>
                
                <p className="client-overview">{client.overview}</p>
                
                <div className="client-metrics">
                  <div className="metric">
                    <Grid size={16} />
                    <span>{client.offering_count} offerings</span>
                  </div>
                  <div className="metric">
                    <span>{client.capability_count} capabilities</span>
                  </div>
                </div>
                
                <div className="client-footer">
                  <span className="created-date">
                    <Calendar size={14} />
                    {new Date(client.created_at).toLocaleDateString()}
                  </span>
                  <ArrowUpRight size={20} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
