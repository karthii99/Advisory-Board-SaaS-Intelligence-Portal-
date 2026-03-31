-- Clean up duplicate data before adding unique constraints
-- This removes duplicates while keeping the first occurrence

-- Delete duplicate client details (keep the one with smallest ID)
DELETE FROM client_details 
WHERE id NOT IN (
    SELECT MIN(id)
    FROM client_details
    GROUP BY client_id
);

-- Delete duplicate clients (keep the one with smallest ID)
DELETE FROM clients 
WHERE id NOT IN (
    SELECT MIN(id)
    FROM clients
    GROUP BY name
);

-- Show remaining counts
SELECT 'clients' as table_name, COUNT(*) as count FROM clients
UNION ALL
SELECT 'client_details' as table_name, COUNT(*) as count FROM client_details;
