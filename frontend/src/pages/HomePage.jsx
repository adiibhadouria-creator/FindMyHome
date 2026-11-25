import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import PropertyCard from '../components/PropertyCard';
import { Search, SlidersHorizontal, ShieldCheck, CheckCircle2, Building, Users } from 'lucide-react';

export default function HomePage({ onSelectProperty }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [bachelorFriendly, setBachelorFriendly] = useState(true);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const data = await api.searchProperties({
        city: city || undefined,
        maxRent: maxRent || undefined,
        bachelorFriendly: bachelorFriendly ? true : undefined,
      });
      setProperties(data?.content || []);
    } catch (err) {
      console.error(err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  return (
    <div className="space-y-10 pb-16">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-emerald-900 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 rounded-3xl overflow-hidden shadow-xl mt-4 max-w-7xl mx-auto">
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
            <ShieldCheck className="w-4 h-4" />
            <span>Anti-Fake Review & Verified Stay Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Transparent Rentals for Bachelors & Young Professionals
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            Say goodbye to fake reviews, hidden landlord rules, and lost deposits. Every review is tied to a cryptographically verified stay.
          </p>

          {/* Search Bar Form */}
          <form 
            onSubmit={handleSearchSubmit}
            className="bg-white p-2.5 rounded-2xl shadow-xl flex flex-wrap items-center gap-2 max-w-2xl mx-auto text-slate-800 text-xs"
          >
            <div className="flex-1 min-w-[140px] flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl">
              <Building className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="City (e.g. Bengaluru, Pune)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-slate-800 placeholder-slate-400"
              />
            </div>

            <div className="min-w-[130px] flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl">
              <span className="text-slate-400 font-semibold">₹</span>
              <input
                type="number"
                placeholder="Max Budget"
                value={maxRent}
                onChange={(e) => setMaxRent(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-slate-800 placeholder-slate-400"
              />
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl">
              <input
                type="checkbox"
                id="heroBachelor"
                checked={bachelorFriendly}
                onChange={(e) => setBachelorFriendly(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="heroBachelor" className="text-slate-700 font-medium cursor-pointer">
                Bachelor Friendly
              </label>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center gap-1.5 transition shadow-sm"
            >
              <Search className="w-3.5 h-3.5" />
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 font-bold">
            1
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Zero Unverified Reviews</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              No random accounts can rate a landlord or tenant. Reviews only unlock after completed physical occupancy.
            </p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0 font-bold">
            2
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Privacy Gating</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Personal contact details and exact addresses stay shielded until both sides formally connect.
            </p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0 font-bold">
            3
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Dual-Move Confirmation</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Both tenant and owner must confirm move-in and move-out before stays become active or closed.
            </p>
          </div>
        </div>
      </section>

      {/* Property Listings Grid */}
      <section className="max-w-7xl mx-auto px-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Verified Rental Listings</h2>
            <p className="text-xs text-slate-500">Explore trusted housing with genuine stay records</p>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {properties.length} Listings Available
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <p className="text-sm text-slate-500 font-medium">Loading verified properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
            <Building className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-800">No properties found</h3>
            <p className="text-xs text-slate-400 mt-1">Try clearing your search filters or check back shortly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onSelect={() => onSelectProperty(prop)}
              />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
