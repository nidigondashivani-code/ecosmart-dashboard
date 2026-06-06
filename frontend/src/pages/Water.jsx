import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import { Droplets, CalendarDays, AlertCircle } from 'lucide-react';

const Water = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWaterData = async () => {
      try {
        const response = await fetch('https://ecosmart-dashboard.onrender.com/api/water');
        const result = await response.json();
        setData(result[0] || result);
      } catch (error) {
        console.error("Failed to fetch API, using fallback data", error);
        setData({ daily_usage: 1250, monthly_usage: 34000, leak_detected: false });
      } finally {
        setLoading(false);
      }
    };
    fetchWaterData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-white mb-2">Water Conservation</h2>
        <p className="text-slate-400">Monitor usage and detect anomalies.</p>
      </header>

      {data?.leak_detected && (
        <div className="bg-danger/20 border border-danger/50 p-4 rounded-xl flex items-center gap-4 text-white">
          <div className="bg-danger p-3 rounded-full">
            <AlertCircle size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-danger">Leak Detected{data?.location ? ` at ${data.location}` : ''}!</h3>
            <p className="text-slate-200 text-sm">Abnormal continuous water flow detected. Please inspect pipelines immediately.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard 
          title="Daily Usage" 
          value={`${data?.daily_usage?.toLocaleString() || 0} L`}
          icon={<Droplets size={24} />} 
          subtitle="Target: < 1500 L"
          colorClass={data?.daily_usage > 1500 ? "text-danger" : "text-info"}
          bgClass={data?.daily_usage > 1500 ? "bg-danger/20" : "bg-info/20"}
        />
        <StatCard 
          title="Monthly Usage" 
          value={`${data?.monthly_usage?.toLocaleString() || 0} L`}
          icon={<CalendarDays size={24} />} 
          subtitle="Updated today"
          colorClass="text-primary"
          bgClass="bg-primary/20"
        />
      </div>
    </div>
  );
};

export default Water;
