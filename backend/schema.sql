-- Supabase Schema for EcoSmart Dashboard

-- 1. Waste Bins
CREATE TABLE IF NOT EXISTS waste_bins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bin_id VARCHAR(50) NOT NULL UNIQUE,
  location VARCHAR(255) NOT NULL,
  fill_level INTEGER NOT NULL DEFAULT 0,
  waste_type VARCHAR(50) DEFAULT 'Unknown',
  composition JSONB DEFAULT '{"plastic": 0, "paper": 0, "organic": 0, "metal": 0, "glass": 0}'::jsonb,
  last_collected TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Pollution Logs
CREATE TABLE IF NOT EXISTS pollution_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  aqi INTEGER NOT NULL,
  temperature FLOAT NOT NULL,
  humidity FLOAT NOT NULL,
  pm25 FLOAT DEFAULT 0,
  co FLOAT DEFAULT 0,
  dust FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Water Usage (Aggregated)
CREATE TABLE IF NOT EXISTS water_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  daily_usage INTEGER NOT NULL,
  monthly_usage INTEGER NOT NULL,
  leak_detected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Dummy Data

-- Waste
INSERT INTO waste_bins (bin_id, location, fill_level, waste_type, composition) VALUES 
('BIN001', 'Block A', 85, 'Plastic', '{"plastic": 85, "paper": 10, "organic": 5, "metal": 0, "glass": 0}'::jsonb),
('BIN002', 'Block B', 40, 'Organic', '{"plastic": 5, "paper": 5, "organic": 90, "metal": 0, "glass": 0}'::jsonb),
('BIN003', 'Cafeteria', 92, 'Mixed', '{"plastic": 40, "paper": 20, "organic": 30, "metal": 5, "glass": 5}'::jsonb),
('BIN004', 'Library', 15, 'Paper', '{"plastic": 0, "paper": 95, "organic": 5, "metal": 0, "glass": 0}'::jsonb),
('BIN005', 'Main Gate', 60, 'Metal', '{"plastic": 10, "paper": 0, "organic": 0, "metal": 80, "glass": 10}'::jsonb)
ON CONFLICT (bin_id) DO UPDATE SET fill_level = EXCLUDED.fill_level, waste_type = EXCLUDED.waste_type, composition = EXCLUDED.composition;

-- Pollution
INSERT INTO pollution_logs (aqi, temperature, humidity, pm25, co, dust) VALUES 
(145, 32.5, 70, 45, 1.5, 80),
(160, 33.0, 68, 55, 3.2, 180),
(130, 31.0, 72, 35, 1.0, 60);

-- Water
INSERT INTO water_usage (daily_usage, monthly_usage, leak_detected) VALUES 
(1250, 34000, FALSE),
(1400, 35400, TRUE);
