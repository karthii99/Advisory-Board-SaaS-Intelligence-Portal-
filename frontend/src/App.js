import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Brain, Database, Search, Grid, List, Calendar, ArrowUpRight, AlertTriangle, Target, Star, Award, Users, TrendingUp, TrendingDown, Zap, DollarSign, Shield, Loader2 } from 'lucide-react';
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
      setError(null);
      
      const response = await axios.post(`${API_BASE_URL}/clients/seed`);
      
      // Handle different response scenarios
      if (response.data.success) {
        if (response.data.inserted > 0) {
          // Fresh seed - refresh data
          await fetchClients();
          alert(`✅ Successfully seeded ${response.data.inserted} new companies!`);
        } else {
          // Data already exists - still refresh to ensure UI is in sync
          await fetchClients();
          alert('ℹ️ Database already contains data - no new companies added');
        }
      } else {
        setError(response.data.message || 'Seeding failed');
      }
    } catch (error) {
      setError('Failed to seed database.');
      console.error('Seeding error:', error);
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
              <div className="intelligence-dashboard">
                <h3>Intelligence Analysis</h3>
                
                {/* Key Metrics */}
                <div className="metrics-grid">
                  <div className="metric-card">
                    <div className="metric-header">
                      <h4>Positioning</h4>
                      <Target size={20} />
                    </div>
                    <div className="metric-value">
                      {selectedClient.intelligence.positioning?.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="metric-card">
                    <div className="metric-header">
                      <h4>Overall Score</h4>
                      <Star size={20} />
                    </div>
                    <div className="metric-value">
                      {((selectedClient.intelligence.differentiator_score + 
                        selectedClient.intelligence.market_score + 
                        selectedClient.intelligence.product_score + 
                        selectedClient.intelligence.pricing_score + 
                        selectedClient.intelligence.moat_score) / 5).toFixed(1)}
                    </div>
                  </div>
                  
                  <div className="metric-card">
                    <div className="metric-header">
                      <h4>Verdict</h4>
                      <Award size={20} />
                    </div>
                    <div className="metric-value verdict">
                      {selectedClient.intelligence.verdict}
                    </div>
                  </div>
                  
                  <div className="metric-card">
                    <div className="metric-header">
                      <h4>Best Fit</h4>
                      <Users size={20} />
                    </div>
                    <div className="metric-value">
                      {selectedClient.intelligence.best_fit}
                    </div>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="score-breakdown">
                  <h4>Score Analysis</h4>
                  <div className="score-bars">
                    <div className="score-item">
                      <span>Differentiator</span>
                      <div className="score-bar">
                        <div 
                          className="score-fill"
                          style={{ 
                            width: `${selectedClient.intelligence.differentiator_score * 10}%`,
                            backgroundColor: selectedClient.intelligence.differentiator_score >= 8 ? '#10b981' : 
                                           selectedClient.intelligence.differentiator_score >= 6 ? '#f59e0b' : '#ef4444'
                          }}
                        ></div>
                      </div>
                      <span>{selectedClient.intelligence.differentiator_score}/10</span>
                    </div>
                    
                    <div className="score-item">
                      <span>Market</span>
                      <div className="score-bar">
                        <div 
                          className="score-fill"
                          style={{ 
                            width: `${selectedClient.intelligence.market_score * 10}%`,
                            backgroundColor: selectedClient.intelligence.market_score >= 8 ? '#10b981' : 
                                           selectedClient.intelligence.market_score >= 6 ? '#f59e0b' : '#ef4444'
                          }}
                        ></div>
                      </div>
                      <span>{selectedClient.intelligence.market_score}/10</span>
                    </div>
                    
                    <div className="score-item">
                      <span>Product</span>
                      <div className="score-bar">
                        <div 
                          className="score-fill"
                          style={{ 
                            width: `${selectedClient.intelligence.product_score * 10}%`,
                            backgroundColor: selectedClient.intelligence.product_score >= 8 ? '#10b981' : 
                                           selectedClient.intelligence.product_score >= 6 ? '#f59e0b' : '#ef4444'
                          }}
                        ></div>
                      </div>
                      <span>{selectedClient.intelligence.product_score}/10</span>
                    </div>
                    
                    <div className="score-item">
                      <span>Pricing</span>
                      <div className="score-bar">
                        <div 
                          className="score-fill"
                          style={{ 
                            width: `${selectedClient.intelligence.pricing_score * 10}%`,
                            backgroundColor: selectedClient.intelligence.pricing_score >= 8 ? '#10b981' : 
                                           selectedClient.intelligence.pricing_score >= 6 ? '#f59e0b' : '#ef4444'
                          }}
                        ></div>
                      </div>
                      <span>{selectedClient.intelligence.pricing_score}/10</span>
                    </div>
                    
                    <div className="score-item">
                      <span>Moat</span>
                      <div className="score-bar">
                        <div 
                          className="score-fill"
                          style={{ 
                            width: `${selectedClient.intelligence.moat_score * 10}%`,
                            backgroundColor: selectedClient.intelligence.moat_score >= 8 ? '#10b981' : 
                                           selectedClient.intelligence.moat_score >= 6 ? '#f59e0b' : '#ef4444'
                          }}
                        ></div>
                      </div>
                      <span>{selectedClient.intelligence.moat_score}/10</span>
                    </div>
                  </div>
                </div>

                {/* Analysis Sections */}
                <div className="analysis-grid">
                  <div className="analysis-card">
                    <h4><TrendingUp size={20} /> Strengths</h4>
                    <ul>
                      {selectedClient.intelligence.strengths?.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="analysis-card">
                    <h4><TrendingDown size={20} /> Weaknesses</h4>
                    <ul>
                      {selectedClient.intelligence.weaknesses?.map((weakness, index) => (
                        <li key={index}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="analysis-card">
                    <h4><AlertTriangle size={20} /> Risks</h4>
                    <ul>
                      {selectedClient.intelligence.risks?.map((risk, index) => (
                        <li key={index}>{risk}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="analysis-card">
                    <h4><Target size={20} /> Opportunities</h4>
                    <ul>
                      {selectedClient.intelligence.opportunities?.map((opportunity, index) => (
                        <li key={index}>{opportunity}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Key Takeaway */}
                <div className="key-takeaway">
                  <h4><Brain size={20} /> Key Takeaway</h4>
                  <p>{selectedClient.intelligence.key_takeaway}</p>
                </div>
              </div>
            )}

            {/* Company Details */}
            <div className="company-details">
              <h3>Company Details</h3>
              
              <div className="details-grid">
                <div className="detail-group">
                  <h4><Grid size={20} /> Offerings</h4>
                  <ul>
                    {selectedClient.details.offerings?.map((offering, index) => (
                      <li key={index}>{offering}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="detail-group">
                  <h4><Zap size={20} /> Capabilities</h4>
                  <ul>
                    {selectedClient.details.capabilities?.map((capability, index) => (
                      <li key={index}>{capability}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="detail-group">
                  <h4><DollarSign size={20} /> Pricing</h4>
                  <p>{selectedClient.details.pricing}</p>
                </div>
                
                <div className="detail-group">
                  <h4><Star size={20} /> Benefits</h4>
                  <ul>
                    {selectedClient.details.benefits?.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="detail-group">
                  <h4><Shield size={20} /> Differentiators</h4>
                  <ul>
                    {selectedClient.details.differentiators?.map((differentiator, index) => (
                      <li key={index}>{differentiator}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
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
          <button 
            className="btn btn-primary" 
            onClick={seedDatabase}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Seeding...
              </>
            ) : (
              <>
                <Database size={20} />
                Seed Data
              </>
            )}
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
