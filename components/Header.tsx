import React from 'react';
import { UserProfile } from '../types';

interface HeaderProps {
  userProfile: UserProfile | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ userProfile, onLogout }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary-600">קלוריק</h1>
        {userProfile && (
          <div className="flex items-center gap-4">
            <span className="text-slate-600 hidden sm:inline">שלום, {userProfile.name}</span>
            <button
              onClick={onLogout}
              className="text-sm text-slate-500 hover:text-primary-600 transition-colors"
              title="חזור לבחירת משתמש"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;