import { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import { Trash2, Wind, Droplets, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dummyChartData = [
  { name: 'Mon', aqi: 120, water: 1100 },
  { name: 'Tue', aqi: 130, water: 1150 },
  { name: 'Wed', aqi: 145, water: 1250 },
  { name: 'Thu', aqi: 135, water: 1200 },
  { name: 'Fri', aqi: 152, water: 1400 },
  { name: 'Sat', aqi: 125, water: 1050 },
  { name: 'Sun', aqi: 115, water: 950 },
];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would fetch from the backend API here.
    // For now, we simulate fetching the dashboard summary.
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('https://ecosmart-dashboard.onrender.com/api/score');
        const result = await response.json();
        
        // Also fetch recommendations
        const recRes = await fetch('https://ecosmart-dashboard.onrender.com/api/recommendations');
        const recData = await recRes.json();
        
        setData({ ...result, recommendations: recData.recommendations });
      } catch (error) {
        console.error("Failed to fetch API, using fallback data", error);
        setData({
          score: 83,
          breakdown: { wastePenalty: 5, pollutionPenalty: 10, waterPenalty: 2 },
          recommendations: ["Collect waste from Block A.", "Air quality is moderate."]
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-white mb-2">Platform Overview</h2>
        <p className="text-slate-400">Real-time environmental monitoring dashboard.</p>
      </header>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Eco Score" 
          value={`${data?.score || 0}/100`}
          icon={<Activity size={24} />} 
          subtitle="Overall sustainability index"
          colorClass="text-primary"
          bgClass="bg-primary/20"
        />
        <StatCard 
          title="Active Bins" 
          value={data?.stats?.totalBins || 0} 
          icon={<Trash2 size={24} />} 
          subtitle={`${data?.stats?.criticalBins || 0} bins need collection`}
          colorClass="text-warning"
          bgClass="bg-warning/20"
        />
        <StatCard 
          title="Current AQI" 
          value={data?.stats?.latestAqi || 0} 
          icon={<Wind size={24} />} 
          subtitle={data?.stats?.latestAqi >= 150 ? "Unhealthy Air Quality" : "Moderate Air Quality"}
          colorClass={data?.stats?.latestAqi >= 150 ? "text-danger" : "text-warning"}
          bgClass={data?.stats?.latestAqi >= 150 ? "bg-danger/20" : "bg-warning/20"}
        />
        <StatCard 
          title="Daily Water" 
          value={`${data?.stats?.waterUsage?.toLocaleString() || 0} L`} 
          icon={<Droplets size={24} />} 
          subtitle={data?.stats?.waterUsage > 1300 ? "High consumption detected" : "Usage is within normal limits"}
          colorClass={data?.stats?.waterUsage > 1300 ? "text-danger" : "text-info"}
          bgClass={data?.stats?.waterUsage > 1300 ? "bg-danger/20" : "bg-info/20"}
        />
      </div>

      {/* Main Charts & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 glass-panel p-6">
          <h3 className="text-xl font-bold text-white mb-6">Weekly Environmental Trends</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dummyChartData}>
                <defs>
                  <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis yAxisId="left" stroke="#94a3b8" />
                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area yAxisId="left" type="monotone" dataKey="aqi" stroke="#ef4444" fillOpacity={1} fill="url(#colorAqi)" name="AQI Level" />
                <Area yAxisId="right" type="monotone" dataKey="water" stroke="#3b82f6" fillOpacity={1} fill="url(#colorWater)" name="Water (L)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="glass-panel p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">AI Assistant</h3>
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
          </div>
          
          <div className="flex-1 space-y-4 overflow-y-auto">
            {data?.recommendations?.map((rec, index) => {
              const isAlert = rec.toLowerCase().includes('critical') || rec.toLowerCase().includes('immediately');
              const isWarning = rec.toLowerCase().includes('moderate') || rec.toLowerCase().includes('high');
              
              let bgColor = 'bg-surfaceLight/50';
              let textColor = 'text-slate-300';
              let borderColor = 'border-transparent';
              
              if (isAlert) {
                bgColor = 'bg-danger/10';
                textColor = 'text-danger';
                borderColor = 'border-danger/30';
              } else if (isWarning) {
                bgColor = 'bg-warning/10';
                textColor = 'text-warning';
                borderColor = 'border-warning/30';
              }

              return (
                <div key={index} className={`p-4 rounded-lg border ${borderColor} ${bgColor}`}>
                  <p className={`text-sm ${textColor}`}>{rec}</p>
                </div>
              );
            })}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;
