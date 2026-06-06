import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import { Trash2, AlertTriangle, CheckCircle, Scan, Sparkles, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

const COLORS = {
  Plastic: '#3b82f6', // blue
  Paper: '#f59e0b', // amber
  Organic: '#10b981', // emerald
  Metal: '#64748b', // slate
  Glass: '#0ea5e9', // sky
  Mixed: '#8b5cf6'  // violet
};

const Waste = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanningBin, setScanningBin] = useState(null);

  useEffect(() => {
    const fetchWasteData = async () => {
      try {
        const response = await fetch('https://ecosmart-dashboard.onrender.com/api/waste');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch API, using fallback data", error);
        setData([
          { bin_id: 'BIN001', location: 'Block A', fill_level: 85, waste_type: 'Plastic' },
          { bin_id: 'BIN002', location: 'Block B', fill_level: 40, waste_type: 'Organic' },
          { bin_id: 'BIN003', location: 'Cafeteria', fill_level: 92, waste_type: 'Mixed' },
          { bin_id: 'BIN004', location: 'Library', fill_level: 15, waste_type: 'Paper' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchWasteData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  const criticalBins = data.filter(b => b.fill_level > 80).length;
  const avgFill = Math.round(data.reduce((acc, curr) => acc + curr.fill_level, 0) / (data.length || 1));

  // Compute composition for the pie chart
  const compositionMap = data.reduce((acc, bin) => {
    const type = bin.waste_type || 'Mixed';
    acc[type] = (acc[type] || 0) + bin.fill_level;
    return acc;
  }, {});

  const pieData = Object.keys(compositionMap).map(key => ({
    name: key,
    value: compositionMap[key]
  }));

  const handleScan = (binId) => {
    setScanningBin(binId);
    setTimeout(() => {
      setScanningBin(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-white mb-2">Waste Management & AI Classification</h2>
        <p className="text-slate-400">Monitor smart bins, collection schedules, and AI-detected waste composition.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Bins" 
          value={data.length}
          icon={<Trash2 size={24} />} 
          colorClass="text-info"
          bgClass="bg-info/20"
        />
        <StatCard 
          title="Average Fill Level" 
          value={`${avgFill}%`}
          icon={<Activity size={24} />} 
          colorClass={avgFill > 70 ? "text-warning" : "text-primary"}
          bgClass={avgFill > 70 ? "bg-warning/20" : "bg-primary/20"}
        />
        <StatCard 
          title="Critical Bins" 
          value={criticalBins}
          icon={<AlertTriangle size={24} />} 
          subtitle="Needs immediate collection"
          colorClass={criticalBins > 0 ? "text-danger" : "text-slate-400"}
          bgClass={criticalBins > 0 ? "bg-danger/20" : "bg-surfaceLight/50"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Composition Pie Chart */}
        <div className="glass-panel p-6 flex flex-col">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Sparkles size={20} className="text-info" />
            AI Waste Composition
          </h3>
          <p className="text-sm text-slate-400 mb-6">Aggregate classification of campus waste detected by AI models.</p>
          
          <div className="h-64 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || COLORS.Mixed} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value, name) => [`${value} Units`, name]}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bin Fill Levels Bar Chart */}
        <div className="glass-panel p-6">
          <h3 className="text-xl font-bold text-white mb-6">Bin Fill Levels</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="location" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  cursor={{fill: '#334155', opacity: 0.4}}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="fill_level" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill_level > 80 ? '#ef4444' : entry.fill_level > 50 ? '#f59e0b' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Interactive Bin List with AI Scanner */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-6">Live AI Bin Feeds</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map((bin) => {
            const isScanning = scanningBin === bin.bin_id;
            const wasteType = bin.waste_type || 'Mixed';
            
            return (
              <div key={bin.bin_id} className="flex flex-col p-5 rounded-lg bg-surfaceLight/30 border border-surfaceLight relative overflow-hidden transition-all">
                {/* Scanner Laser Animation Overlay */}
                {isScanning && (
                  <div className="absolute inset-0 bg-info/5 pointer-events-none z-10 flex flex-col justify-between">
                    <div className="h-1 bg-info/80 w-full shadow-[0_0_15px_rgba(59,130,246,1)] animate-[scan_1.5s_ease-in-out_infinite_alternate]"></div>
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${bin.fill_level > 80 ? 'bg-danger/20 text-danger' : 'bg-primary/20 text-primary'}`}>
                      {bin.fill_level > 80 ? <AlertTriangle size={24} /> : <CheckCircle size={24} />}
                    </div>
                    <div>
                      <h4 className="text-lg text-white font-bold">{bin.location}</h4>
                      <p className="text-sm text-slate-400">ID: {bin.bin_id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-2xl font-bold ${bin.fill_level > 80 ? 'text-danger' : 'text-white'}`}>
                      {bin.fill_level}%
                    </span>
                    <p className="text-xs text-slate-400 mt-1">Full</p>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-surfaceLight/50 flex items-center justify-between">
                  <div>
                    {isScanning ? (
                      <div className="flex items-center gap-2 text-info animate-pulse">
                        <RefreshCw size={16} className="animate-spin" />
                        <span className="text-sm font-medium">Running Vision Model...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Classification:</span>
                          <span 
                            className="px-2 py-1 rounded text-xs font-bold" 
                            style={{ backgroundColor: `${COLORS[wasteType]}20`, color: COLORS[wasteType] }}
                          >
                            {wasteType}
                          </span>
                        </div>
                        {wasteType === 'Mixed' && (
                          <div className="mt-1 w-full max-w-[200px]">
                            <div className="flex w-full h-1.5 rounded-full overflow-hidden bg-surfaceLight">
                              {Object.entries(bin.composition || { Plastic: 45, Paper: 30, Metal: 25 }).map(([type, pct]) => (
                                <div 
                                  key={type}
                                  style={{ width: `${pct}%`, backgroundColor: COLORS[type] }} 
                                  title={`${type}: ${pct}%`}
                                />
                              ))}
                            </div>
                            <div className="flex gap-2 mt-1.5">
                              {Object.entries(bin.composition || { Plastic: 45, Paper: 30, Metal: 25 }).map(([type, pct]) => (
                                <span key={type} className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[type] }}></span>
                                  {pct}% {type}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => handleScan(bin.bin_id)}
                    disabled={isScanning}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isScanning ? 'bg-surfaceLight text-slate-400 cursor-not-allowed' : 'bg-info/20 text-info hover:bg-info/30 hover:shadow-lg hover:shadow-info/20'
                    }`}
                  >
                    <Scan size={16} />
                    Scan Bin
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Simple Activity icon fallback for this file
const Activity = ({size}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
);

export default Waste;
