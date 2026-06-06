import { useEffect, useState } from 'react';
import { FileText, Download } from 'lucide-react';

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const scoreRes = await fetch('https://ecosmart-dashboard.onrender.com/api/score');
        const scoreData = await scoreRes.json();
        
        const recRes = await fetch('https://ecosmart-dashboard.onrender.com/api/recommendations');
        const recData = await recRes.json();
        
        setData({ ...scoreData, recommendations: recData.recommendations });
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
    fetchReportData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <header>
          <h2 className="text-3xl font-bold text-white mb-2">Sustainability Report</h2>
          <p className="text-slate-400">Weekly comprehensive analysis and scoring.</p>
        </header>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Download size={18} />
          Export PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-8 flex flex-col items-center justify-center text-center">
          <h3 className="text-xl font-bold text-white mb-2">Overall Eco Score</h3>
          <p className="text-slate-400 text-sm mb-8">Out of 100 points</p>
          
          <div className="relative w-48 h-48 flex items-center justify-center bg-surfaceLight/30 rounded-full border-[12px] border-primary/20">
            <span className="text-6xl font-extrabold text-primary">{data?.score}</span>
          </div>
          <p className="mt-8 text-lg font-medium text-white">Status: 
            <span className={`ml-2 ${data?.score >= 80 ? 'text-primary' : data?.score >= 60 ? 'text-warning' : 'text-danger'}`}>
              {data?.score >= 80 ? 'Excellent' : data?.score >= 60 ? 'Needs Improvement' : 'Critical'}
            </span>
          </p>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FileText size={20} className="text-primary" />
              Penalty Breakdown
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">Waste Penalty</span>
                  <span className="text-danger font-medium">-{data?.breakdown?.wastePenalty || 0} pts</span>
                </div>
                <div className="w-full bg-surfaceLight rounded-full h-2">
                  <div className="bg-danger h-2 rounded-full" style={{ width: `${Math.min((data?.breakdown?.wastePenalty || 0) * 5, 100)}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">Pollution Penalty</span>
                  <span className="text-danger font-medium">-{data?.breakdown?.pollutionPenalty || 0} pts</span>
                </div>
                <div className="w-full bg-surfaceLight rounded-full h-2">
                  <div className="bg-warning h-2 rounded-full" style={{ width: `${Math.min((data?.breakdown?.pollutionPenalty || 0) * 5, 100)}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">Water Penalty</span>
                  <span className="text-danger font-medium">-{data?.breakdown?.waterPenalty || 0} pts</span>
                </div>
                <div className="w-full bg-surfaceLight rounded-full h-2">
                  <div className="bg-info h-2 rounded-full" style={{ width: `${Math.min((data?.breakdown?.waterPenalty || 0) * 5, 100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6">
            <h3 className="text-xl font-bold text-white mb-4">Action Items</h3>
            <ul className="space-y-3">
              {data?.recommendations?.map((rec, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0"></span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
