import React from 'react';

const StatCard = ({ title, value, icon, subtitle, colorClass = "text-primary", bgClass = "bg-primary/20" }) => {
  return (
    <div className="glass-panel p-6 card-hover flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${bgClass} ${colorClass}`}>
          {icon}
        </div>
      </div>
      {subtitle && (
        <p className="text-sm text-slate-400 mt-auto">{subtitle}</p>
      )}
    </div>
  );
};

export default StatCard;
