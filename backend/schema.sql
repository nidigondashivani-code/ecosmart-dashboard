-- Supabase Schema for EcoSmart Dashboard

-- 1. Waste Bins
CREATE TABLE IF NOT EXISTS waste_bins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bin_id VARCHAR(50) NOT NULL UNIQUE,
  location VARCHAR(255) NOT NULL,
  fill_level INTEGER NOT NULL DEFAULT 0,
  last_collected TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Pollution Logs
CREATE TABLE IF NOT EXISTS pollution_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  aqi INTEGER NOT NULL,
  temperature FLOAT NOT NULL,
  humidity FLOAT NOT NULL,
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
INSERT INTO waste_bins (bin_id, location, fill_level) VALUES 
('BIN001', 'Block A', 85),
('BIN002', 'Block B', 40),
('BIN003', 'Cafeteria', 92),
('BIN004', 'Library', 15)
ON CONFLICT (bin_id) DO UPDATE SET fill_level = EXCLUDED.fill_level;

-- Pollution
INSERT INTO pollution_logs (aqi, temperature, humidity) VALUES 
(145, 32.5, 70),
(152, 33.0, 68),
(130, 31.0, 72);

-- Water
INSERT INTO water_usage (daily_usage, monthly_usage, leak_detected) VALUES 
(1250, 34000, FALSE),
(1400, 35400, TRUE);
