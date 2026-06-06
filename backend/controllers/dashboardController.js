import { supabase } from '../supabaseClient.js';

// Fallback dummy data in case Supabase is not configured yet
const dummyData = {
  waste: [
    { bin_id: 'BIN001', location: 'Block A', fill_level: 85, waste_type: 'Plastic' },
    { bin_id: 'BIN002', location: 'Block B', fill_level: 40, waste_type: 'Organic' }
  ],
  pollution: [
    { aqi: 145, temperature: 32, humidity: 70, pm25: 65, co: 4, dust: 120 }
  ],
  water: [
    { daily_usage: 1250, monthly_usage: 34000, leak_detected: true, location: 'Block B Ground Floor' }
  ]
};

export const getWaste = async (req, res) => {
  if (supabase) {
    const { data, error } = await supabase.from('waste_bins').select('*').order('fill_level', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }
  res.json(dummyData.waste);
};

export const getPollution = async (req, res) => {
  if (supabase) {
    const { data, error } = await supabase.from('pollution_logs').select('*').order('created_at', { ascending: false }).limit(1);
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }
  res.json(dummyData.pollution);
};

export const getWater = async (req, res) => {
  if (supabase) {
    const { data, error } = await supabase.from('water_usage').select('*').order('created_at', { ascending: false }).limit(1);
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }
  res.json(dummyData.water);
};

export const getScore = async (req, res) => {
  try {
    let wasteData = dummyData.waste;
    let pollutionData = dummyData.pollution;
    let waterData = dummyData.water;

    if (supabase) {
      const wRes = await supabase.from('waste_bins').select('*');
      if (wRes.data) wasteData = wRes.data;

      const pRes = await supabase.from('pollution_logs').select('*').order('created_at', { ascending: false }).limit(1);
      if (pRes.data) pollutionData = pRes.data;

      const wtRes = await supabase.from('water_usage').select('*').order('created_at', { ascending: false }).limit(1);
      if (wtRes.data) waterData = wtRes.data;
    }

    // Calculate Penalties
    let wastePenalty = 0;
    const overflowingBins = wasteData.filter(b => b.fill_level > 80).length;
    wastePenalty = overflowingBins * 5; // 5 points penalty for every overflowing bin

    let pollutionPenalty = 0;
    const latestAqi = pollutionData[0]?.aqi || 0;
    if (latestAqi > 100 && latestAqi <= 150) pollutionPenalty = 10;
    else if (latestAqi > 150) pollutionPenalty = 25;

    let waterPenalty = 0;
    const latestWater = waterData[0] || {};
    if (latestWater.leak_detected) waterPenalty = 20;
    else if (latestWater.daily_usage > 1300) waterPenalty = 10;

    const overallScore = 100 - wastePenalty - pollutionPenalty - waterPenalty;
    
    // Ensure score doesn't go below 0
    const finalScore = Math.max(0, overallScore);

    res.json({
      score: finalScore,
      breakdown: {
        wastePenalty,
        pollutionPenalty,
        waterPenalty
      },
      stats: {
        totalBins: wasteData.length,
        criticalBins: overflowingBins,
        latestAqi: latestAqi,
        waterUsage: latestWater.daily_usage || 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to calculate score" });
  }
};

export const getRecommendations = async (req, res) => {
  try {
    let wasteData = dummyData.waste;
    let pollutionData = dummyData.pollution;
    let waterData = dummyData.water;

    if (supabase) {
      const wRes = await supabase.from('waste_bins').select('*');
      if (wRes.data) wasteData = wRes.data;

      const pRes = await supabase.from('pollution_logs').select('*').order('created_at', { ascending: false }).limit(1);
      if (pRes.data) pollutionData = pRes.data;

      const wtRes = await supabase.from('water_usage').select('*').order('created_at', { ascending: false }).limit(1);
      if (wtRes.data) waterData = wtRes.data;
    }

    const recommendations = [];

    // Waste Rules
    const fullBins = wasteData.filter(b => b.fill_level > 80);
    if (fullBins.length > 0) {
      recommendations.push(`Collect waste immediately from ${fullBins.map(b => b.location).join(', ')}.`);
    } else {
      recommendations.push("Waste levels are manageable. Continue regular schedule.");
    }

    // Pollution Rules
    const aqi = pollutionData[0]?.aqi || 0;
    if (aqi > 150) {
      recommendations.push("Air quality is unhealthy. Limit outdoor activities and consider air purifiers.");
    } else if (aqi > 100) {
      recommendations.push("Air quality is moderate. Monitor sensitive groups.");
    } else {
      recommendations.push("Air quality is good.");
    }

    // Water Rules
    const water = waterData[0] || {};
    if (water.leak_detected) {
      const leakLocation = water.location ? ` at ${water.location}` : '';
      recommendations.push(`CRITICAL: Water leak detected${leakLocation}! Inspect pipes immediately.`);
    } else if (water.daily_usage > 1300) {
      recommendations.push("High water consumption detected. Implement water-saving measures.");
    } else {
      recommendations.push("Water consumption is within normal limits.");
    }

    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
};
