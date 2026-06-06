import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import { Wind, Thermometer, Droplet, AlertTriangle, Factory, Car, Pickaxe, ShieldAlert, CheckCircle } from 'lucide-react';

const Pollution = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPollutionData = async () => {
      try {
        const response = await fetch('https://ecosmart-dashboard.onrender.com/api/pollution');
        const result = await response.json();
        setData(result[0] || result);
      } catch (error) {
        console.error("Failed to fetch API, using fallback data", error);
        setData({ aqi: 145, temperature: 32, humidity: 70, pm25: 65, co: 4, dust: 120 });
      } finally {
        setLoading(false);
      }
    };
    fetchPollutionData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  const aqi = data?.aqi || 0;
  
  // Health Advisory Logic
  let advisory = "Air quality is good. Safe for all outdoor activities.";
  let advisoryColor = "text-primary";
  let advisoryBg = "bg-primary/20";
  let AdvisoryIcon = CheckCircle;
  
  if (aqi >= 250) {
    advisory = "CRITICAL: Wear a mask and avoid prolonged outdoor exposure. Stay indoors if possible.";
    advisoryColor = "text-danger";
    advisoryBg = "bg-danger/20";
    AdvisoryIcon = ShieldAlert;
  } else if (aqi >= 150) {
    advisory = "WARNING: Limit outdoor exercise. Sensitive groups should stay indoors.";
    advisoryColor = "text-warning";
    advisoryBg = "bg-warning/20";
    AdvisoryIcon = AlertTriangle;
  } else if (aqi >= 50) {
    advisory = "Moderate air quality. Safe for normal outdoor activities.";
    advisoryColor = "text-info";
    advisoryBg = "bg-info/20";
    AdvisoryIcon = CheckCircle;
  }

  // AI Source Detection Logic
  const pm25 = data?.pm25 || 0;
  const co = data?.co || 0;
  const dust = data?.dust || 0;

  // Normalize for comparison (just a mock logic for presentation)
  const normPm25 = pm25 * 2; 
  const normCo = co * 30; 
  const normDust = dust;

  let source = "Normal Levels";
  let sourceDesc = "Pollutants are within acceptable ranges.";
  let SourceIcon = Wind;

  if (normDust > normPm25 && normDust > normCo && dust > 80) {
    source = "Construction Activities";
    sourceDesc = "High dust density detected. Likely from nearby construction or earthworks.";
    SourceIcon = Pickaxe;
  } else if (normCo > normPm25 && normCo > normDust && co > 3) {
    source = "Industrial Emissions";
    sourceDesc = "Elevated Carbon Monoxide (CO). Likely from nearby factory exhaust or burning.";
    SourceIcon = Factory;
  } else if (normPm25 > normCo && normPm25 > normDust && pm25 > 35) {
    source = "Heavy Traffic Nearby";
    sourceDesc = "High PM2.5 levels. Likely due to severe vehicle exhaust and traffic congestion.";
    SourceIcon = Car;
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-white mb-2">Pollution Monitoring</h2>
        <p className="text-slate-400">Track air quality, AI source detection, and health advisories.</p>
      </header>

      {/* Health Advisory Banner */}
      <div className={`p-4 rounded-xl flex items-center gap-4 ${advisoryBg} border border-surfaceLight`}>
        <div className={`p-3 rounded-full ${advisoryColor}`}>
          <AdvisoryIcon size={28} />
        </div>
        <div>
          <h3 className={`font-bold text-lg ${advisoryColor}`}>Health Advisory System</h3>
          <p className="text-slate-200">{advisory}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="AQI Level" 
          value={aqi}
          icon={<Wind size={24} />} 
          colorClass={advisoryColor}
          bgClass={advisoryBg}
        />
        <StatCard 
          title="PM2.5" 
          value={`${pm25} µg/m³`}
          icon={<Wind size={24} />} 
          colorClass="text-danger"
          bgClass="bg-danger/20"
        />
        <StatCard 
          title="Carbon Monoxide" 
          value={`${co} ppm`}
          icon={<Factory size={24} />} 
          colorClass="text-warning"
          bgClass="bg-warning/20"
        />
        <StatCard 
          title="Dust Density" 
          value={`${dust} µg/m³`}
          icon={<Pickaxe size={24} />} 
          colorClass="text-info"
          bgClass="bg-info/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AQI Meter */}
        <div className="glass-panel p-8 flex flex-col items-center justify-center text-center">
          <h3 className="text-2xl font-bold text-white mb-6">Real-Time Air Quality Index</h3>
          
          <div className="relative w-56 h-56 mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1e293b" strokeWidth="10" />
              <circle
                cx="50" cy="50" r="40" fill="transparent"
                stroke={aqi >= 250 ? '#ef4444' : aqi >= 150 ? '#f59e0b' : '#10b981'}
                strokeWidth="10"
                strokeDasharray={`${Math.min((aqi / 300) * 251, 251)} 251`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-bold text-white">{aqi}</span>
              <span className={`text-sm font-semibold mt-1 uppercase tracking-wide ${advisoryColor}`}>
                {aqi >= 250 ? 'Unhealthy' : aqi >= 150 ? 'Moderate' : 'Good'}
              </span>
            </div>
          </div>
        </div>

        {/* AI Source Detection */}
        <div className="glass-panel p-8 flex flex-col justify-center relative overflow-hidden">
          {/* Scanning animation background */}
          <div className="absolute inset-0 bg-info/5 pointer-events-none z-0">
            <div className="h-1 bg-info/40 w-full shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-[scan_2.5s_ease-in-out_infinite_alternate]"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-info opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-info"></span>
              </span>
              <h3 className="text-xl font-bold text-white">AI Source Detection</h3>
            </div>
            
            <p className="text-slate-400 mb-6 text-sm">
              Analyzing PM2.5, CO, and Dust ratios to triangulate probable pollution sources in real-time...
            </p>

            <div className="bg-surfaceLight/40 border border-surfaceLight p-6 rounded-xl flex items-start gap-5">
              <div className="p-4 bg-info/20 text-info rounded-xl">
                <SourceIcon size={32} />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-white mb-2">{source}</h4>
                <p className="text-slate-300">{sourceDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pollution;
