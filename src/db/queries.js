class ClientQueries {
  static get clients() {
    return {
      getAll: `
        SELECT 
          c.id,
          c.name,
          c.industry,
          c.overview,
          c.created_at,
          c.updated_at,
          cd.offerings,
          cd.capabilities,
          cd.benefits,
          cd.differentiators,
          cd.pricing
        FROM clients c
        LEFT JOIN client_details cd ON c.id = cd.client_id
        ORDER BY c.created_at DESC
      `,
      
      getById: `
        SELECT * FROM clients WHERE id = $1
      `,
      
      create: `
        INSERT INTO clients (name, industry, overview) 
        VALUES ($1, $2, $3) 
        RETURNING *
      `,
      
      update: `
        UPDATE clients 
        SET name = $1, industry = $2, overview = $3, updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING *
      `,
      
      delete: `
        DELETE FROM clients WHERE id = $1
      `,
      
      count: `
        SELECT COUNT(*) as count FROM clients
      `
    };
  }

  static get clientDetails() {
    return {
      getByClientId: `
        SELECT * FROM client_details WHERE client_id = $1
      `,
      
      create: `
        INSERT INTO client_details 
        (client_id, offerings, capabilities, benefits, differentiators, pricing) 
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `,
      
      update: `
        UPDATE client_details 
        SET offerings = $1, capabilities = $2, benefits = $3, 
            differentiators = $4, pricing = $5, updated_at = CURRENT_TIMESTAMP
        WHERE client_id = $6
        RETURNING *
      `,
      
      delete: `
        DELETE FROM client_details WHERE client_id = $1
      `
    };
  }

  static get analytics() {
    return {
      industryDistribution: `
        SELECT industry, COUNT(*) as count 
        FROM clients 
        GROUP BY industry 
        ORDER BY count DESC
      `,
      
      monthlyGrowth: `
        SELECT 
          DATE_TRUNC('month', created_at) as month,
          COUNT(*) as new_clients
        FROM clients 
        WHERE created_at >= NOW() - INTERVAL '12 months'
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY month DESC
      `,
      
      intelligenceSummary: `
        SELECT 
          c.industry,
          COUNT(*) as total_clients,
          AVG(CASE 
            WHEN ARRAY_LENGTH(cd.differentiators, 1) >= 3 THEN 9
            WHEN ARRAY_LENGTH(cd.differentiators, 1) >= 2 THEN 7
            WHEN ARRAY_LENGTH(cd.differentiators, 1) >= 1 THEN 5
            ELSE 3
          END) as avg_differentiator_score
        FROM clients c
        LEFT JOIN client_details cd ON c.id = cd.client_id
        GROUP BY c.industry
        ORDER BY total_clients DESC
      `
    };
  }
}

module.exports = ClientQueries;
