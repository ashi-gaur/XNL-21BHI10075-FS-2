import { useState } from 'react';
import { useLocation } from 'wouter';

const Header = ({ openMobileMenu }) => {
  const [location] = useLocation();
  
  // Get page title based on current location
  const getPageTitle = () => {
    switch (location) {
      case '/':
        return 'Dashboard';
      case '/exercises':
        return 'Workouts';
      case '/library':
        return 'Exercise Library';
      case '/settings':
        return 'Settings';
      default:
        return 'FitTrack';
    }
  };
  
  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <button className="md:hidden mr-4 text-slate-700" onClick={openMobileMenu}>
            <i className="ri-menu-line text-xl"></i>
          </button>
          <h2 className="text-xl font-bold text-slate-800">{getPageTitle()}</h2>
        </div>
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-slate-500 hover:text-primary transition-colors">
            <i className="ri-notification-3-line text-xl"></i>
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
          </button>
          <div className="relative group">
            <button className="flex items-center space-x-2 focus:outline-none">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
                JS
              </div>
              <span className="hidden md:inline text-sm font-medium">John</span>
              <i className="ri-arrow-down-s-line text-slate-500"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
