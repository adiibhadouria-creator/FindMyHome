import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Home, ShieldCheck, User as UserIcon, LogOut, PlusCircle, LayoutDashboard } from 'lucide-react';

export default function Navbar({ onNavigate, currentPage, onOpenNewPropertyModal }) {
  const { user, logout, isOwner } = useAuth();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo & Platform Name */}
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-200 group-hover:bg-emerald-700 transition">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                FindMyHome
                <ShieldCheck className="w-4 h-4 text-emerald-600" title="Verified Trust Network" />
              </span>
              <span className="text-xs text-slate-500 font-medium block -mt-1">
                Verified Bachelor & Rental Platform
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentPage === 'home' 
                  ? 'bg-slate-100 text-slate-900 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Search Properties
            </button>

            {user ? (
              <>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    currentPage === 'dashboard' 
                      ? 'bg-slate-100 text-slate-900 font-semibold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard & Stays
                </button>

                {isOwner && (
                  <button
                    onClick={onOpenNewPropertyModal}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm"
                  >
                    <PlusCircle className="w-4 h-4" />
                    List Property
                  </button>
                )}

                <div className="h-6 w-px bg-slate-200 mx-1" />

                <div className="flex items-center gap-2.5 pl-1">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 font-medium text-xs">
                    {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                  </div>
                  <div className="hidden sm:block text-left text-xs">
                    <p className="font-semibold text-slate-800 leading-tight">{user.fullName}</p>
                    <p className="text-slate-500">{user.role === 'ROLE_OWNER' ? 'Property Owner' : 'Tenant'}</p>
                  </div>
                  <button
                    onClick={logout}
                    title="Logout"
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition ml-1"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-3.5 py-2 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
