import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Waste from './pages/Waste';
import Pollution from './pages/Pollution';
import Water from './pages/Water';
import Reports from './pages/Reports';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col md:flex-row">
        <Navbar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/waste" element={<Waste />} />
            <Route path="/pollution" element={<Pollution />} />
            <Route path="/water" element={<Water />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
