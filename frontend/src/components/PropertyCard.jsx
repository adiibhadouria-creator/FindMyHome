import React from 'react';
import { ShieldCheck, MapPin, Bed, Bath, Sparkles, CheckCircle2 } from 'lucide-react';

export default function PropertyCard({ property, onSelect }) {
  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const getFurnishingLabel = (status) => {
    switch (status) {
      case 'FULLY_FURNISHED': return 'Fully Furnished';
      case 'SEMI_FURNISHED': return 'Semi Furnished';
      case 'UNFURNISHED': return 'Unfurnished';
      default: return status;
    }
  };

  return (
    <div 
      onClick={() => onSelect(property)}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition duration-200 cursor-pointer flex flex-col group"
    >
      {/* Property Header / Thumbnail */}
      <div className="h-48 relative p-4 flex flex-col justify-between text-white overflow-hidden bg-slate-900">
        {property.photoUrls ? (
          <img
            src={property.photoUrls.split(',')[0].trim()}
            alt={property.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-800 to-slate-700" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-black/40" />

        <div className="relative z-10 flex justify-between items-start">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600/90 text-white backdrop-blur-md flex items-center gap-1 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Listing
          </span>

          {property.bachelorFriendly && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/25 text-white backdrop-blur-md border border-white/20 shadow-sm">
              Bachelor Friendly
            </span>
          )}
        </div>

        <div className="relative z-10">
          <div className="text-2xl font-bold tracking-tight text-white drop-shadow">
            {formatPrice(property.rentAmount)}
            <span className="text-xs font-normal text-slate-200 ml-1">/ month</span>
          </div>
          <p className="text-xs text-slate-200 mt-0.5 drop-shadow">
            Deposit: {formatPrice(property.depositAmount)}
          </p>
        </div>
      </div>

      {/* Property Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-slate-900 group-hover:text-emerald-700 transition line-clamp-1">
            {property.title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{property.addressLine}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 py-3 mt-3 border-y border-slate-100 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5 text-slate-400" />
              <span>{property.bedrooms} BHK</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5 text-slate-400" />
              <span>{property.bathrooms} Bath</span>
            </div>
            <div className="flex items-center gap-1 truncate">
              <Sparkles className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">{getFurnishingLabel(property.furnishingStatus)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-2 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-800">
            <span className="text-amber-500">★</span>
            <span>{property.averageRating > 0 ? property.averageRating.toFixed(1) : 'New'}</span>
            <span className="text-slate-400 font-normal">({property.averageRating > 0 ? 'Verified Reviews' : 'No stays yet'})</span>
          </div>

          <span className="text-xs font-semibold text-emerald-600 group-hover:underline">
            View & Connect →
          </span>
        </div>
      </div>
    </div>
  );
}
