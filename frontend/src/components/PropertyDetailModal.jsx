import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { X, ShieldCheck, MapPin, Bed, Bath, Sparkles, Send, Phone, Mail, CheckCircle, AlertCircle } from 'lucide-react';

export default function PropertyDetailModal({ property, onClose, onConnectionSent, onSelectUser }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (property?.id) {
      api.getPropertyReviews(property.id)
        .then((data) => setReviews(data || []))
        .catch(() => setReviews([]))
        .finally(() => setLoadingReviews(false));
    }
  }, [property?.id]);

  if (!property) return null;

  const handleSendConnection = async (e) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg('Please sign in as a tenant to send a connection request.');
      return;
    }
    if (user.role !== 'ROLE_TENANT') {
      setErrorMsg('Only registered tenants can send connection requests to property owners.');
      return;
    }

    setSending(true);
    setErrorMsg(null);
    setStatusMsg(null);

    try {
      await api.sendConnection(property.id, message);
      setStatusMsg('Connection request sent! The owner will review your profile.');
      setMessage('');
      if (onConnectionSent) onConnectionSent();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send connection request.');
    } finally {
      setSending(false);
    }
  };

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const amenitiesList = property.amenities
    ? property.amenities.split(',').map((a) => a.trim()).filter(Boolean)
    : ['WiFi', 'Power Backup', 'Water Purifier', 'Washing Machine'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Bar */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Listing #{property.id}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">

          {/* Property Photo Banner */}
          {property.photoUrls && (
            <div className="relative h-64 rounded-2xl overflow-hidden shadow-sm bg-slate-900 -mt-2">
              <img
                src={property.photoUrls.split(',')[0].trim()}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verified Property Photos
              </div>
            </div>
          )}

          {/* Title & Basic Info */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{property.title}</h2>
            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>{property.addressLine}</span>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
            <div>
              <p className="text-xs text-slate-500 font-medium">Monthly Rent</p>
              <p className="text-lg font-bold text-slate-900 mt-0.5">{formatPrice(property.rentAmount)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Security Deposit</p>
              <p className="text-lg font-bold text-slate-900 mt-0.5">{formatPrice(property.depositAmount)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Configuration</p>
              <p className="text-lg font-bold text-slate-900 mt-0.5">{property.bedrooms} BHK</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Furnishing</p>
              <p className="text-sm font-bold text-slate-900 mt-1 truncate">{property.furnishingStatus}</p>
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">About the Property</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{property.description}</p>
            </div>
          )}

          {/* Amenities */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {amenitiesList.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium"
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>

          {/* Owner Profile & Privacy Box */}
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4">
            <h4 className="text-sm font-semibold text-emerald-950 flex items-center gap-1.5 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified Owner Profile
            </h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                  {property.owner?.fullName ? property.owner.fullName[0] : 'O'}
                </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{property.owner?.fullName}</p>
                    <p className="text-xs text-slate-500">{property.owner?.bio || 'Registered Property Owner'}</p>
                    <button
                      type="button"
                      onClick={() => onSelectUser && onSelectUser(property.owner?.id)}
                      className="text-xs text-emerald-700 font-semibold hover:underline mt-1 flex items-center gap-1"
                    >
                      ★ View Landlord Reviews & Reputation →
                    </button>
                  </div>
              </div>

              <div className="text-right text-xs">
                <div className="flex items-center gap-1 text-slate-600">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{property.owner?.phoneNumber || 'Contact Protected'}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-600 mt-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{property.owner?.email || 'Email Protected'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Connect Section for Tenants */}
          {user?.role === 'ROLE_TENANT' && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                <Send className="w-4 h-4 text-emerald-600" />
                Connect with Owner
              </h4>
              <p className="text-xs text-slate-500 mb-3">
                Sending a connection request shares your profile and unlocks direct communication once accepted.
              </p>

              {statusMsg && (
                <div className="mb-3 p-3 bg-emerald-100 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{statusMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="mb-3 p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSendConnection} className="space-y-3">
                <textarea
                  rows="2"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Introduce yourself (e.g. bachelor/student, move-in date, occupation)..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50"
                >
                  {sending ? 'Sending...' : 'Send Connection Request'}
                </button>
              </form>
            </div>
          )}

          {/* Verified Reviews Section */}
          <div className="border-t border-slate-100 pt-6">
            <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-1.5">
              <span>Verified Stay Reviews</span>
              <span className="text-xs font-normal text-slate-400">({reviews.length})</span>
            </h4>

            {loadingReviews ? (
              <p className="text-xs text-slate-400">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-500 font-medium">No verified reviews yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Only tenants who have completed a verified stay can review this property.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-1">
                        <span className="text-amber-500 font-bold">★ {rev.rating}/5</span>
                        <span className="font-semibold text-slate-800 ml-1">{rev.title}</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-medium">
                        Verified Stay #{rev.stayId}
                      </span>
                    </div>
                    <p className="text-slate-600">{rev.comment}</p>
                    <div className="mt-2 text-[10px] text-slate-400">
                      By {rev.author?.fullName} • Cleanliness: {rev.cleanlinessRating}/5 • Communication: {rev.communicationRating}/5
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
