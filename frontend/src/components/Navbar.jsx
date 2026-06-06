import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Trash2, Wind, Droplets, FileBarChart, Leaf } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Waste', path: '/waste', icon: <Trash2 size={20} /> },
    { name: 'Pollution', path: '/pollution', icon: <Wind size={20} /> },
    { name: 'Water', path: '/water', icon: <Droplets size={20} /> },
    { name: 'Reports', path: '/reports', icon: <FileBarChart size={20} /> },
  ];

  return (
    <nav className="w-full md:w-64 glass-panel md:min-h-screen md:rounded-none md:border-y-0 md:border-l-0 flex flex-col justify-between sticky top-0 z-50">
      <div>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-lg text-primary">
            <Leaf size={28} />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-info">
            EcoSmart
          </h1>
        </div>

        <ul className="flex md:flex-col gap-2 p-4 overflow-x-auto md:overflow-visible">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name} className="shrink-0">
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary/20 text-primary font-semibold shadow-inner' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-surfaceLight/50'
                  }`}
                >
                  {item.icon}
                  <span className="hidden md:inline">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="hidden md:block p-6 text-sm text-slate-500">
        &copy; 2026 EcoSmart
      </div>
    </nav>
  );
};

export default Navbar;
