import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { X, ShieldCheck, Star, Phone, Mail, User, AlertCircle, Building, CheckCircle2 } from 'lucide-react';

export default function UserProfileModal({ userId, onClose }) {
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      Promise.all([
        api.getPublicUser(userId),
        api.getUserReviews(userId),
      ])
        .then(([userData, reviewsData]) => {
          setProfile(userData);
          setReviews(reviewsData || []);
        })
        .catch((err) => {
          setError(err.message || 'Failed to load profile');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userId]);

  if (!userId) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-slate-900 text-sm">Verified Reputation & Reviews</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs">
          {loading ? (
            <div className="py-12 text-center text-slate-400">Loading verified reputation profile...</div>
          ) : error ? (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          ) : (
            <>
              {/* User Bio Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-200">
                    {profile?.fullName ? profile.fullName[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-base">{profile?.fullName}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        {profile?.verificationStatus}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      {profile?.role === 'ROLE_OWNER' ? 'Property Owner' : 'Tenant / Bachelor'}
                    </p>
                  </div>
                </div>

                {/* Rating Stat Box */}
                <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm text-center">
                  <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-base">
                    <span>★</span>
                    <span>{profile?.averageRating > 0 ? profile.averageRating.toFixed(1) : 'New'}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {reviews.length} Verified {reviews.length === 1 ? 'Stay Review' : 'Stay Reviews'}
                  </p>
                </div>
              </div>

              {/* Bio & Contacts */}
              <div className="space-y-2">
                {profile?.bio && (
                  <div>
                    <span className="font-semibold text-slate-700 block mb-0.5">About:</span>
                    <p className="text-slate-600 bg-white p-3 rounded-xl border border-slate-100 italic">
                      "{profile.bio}"
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-1 text-slate-600">
                  <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">{profile?.phoneNumber || 'Contact Protected'}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <Mail className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">{profile?.email || 'Email Protected'}</span>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Verified Reviews Received ({reviews.length})
                  </h5>
                  <span className="text-[10px] text-slate-400">Guaranteed by completed stays</span>
                </div>

                {reviews.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Star className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
                    <p className="font-semibold text-slate-700">No verified reviews yet</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 max-w-sm mx-auto">
                      Reviews only unlock after a confirmed stay completes. Random users cannot review this profile.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-amber-500 font-bold">★ {rev.rating}/5</span>
                              <span className="font-bold text-slate-800">{rev.title}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              By {rev.author?.fullName} ({rev.author?.role === 'ROLE_OWNER' ? 'Landlord' : 'Tenant'})
                            </p>
                          </div>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                            Stay #{rev.stayId} Verified
                          </span>
                        </div>

                        <p className="text-slate-600 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-100">
                          {rev.comment}
                        </p>

                        <div className="flex gap-4 text-[11px] text-slate-500 pt-1">
                          {rev.cleanlinessRating && (
                            <span>Cleanliness: <strong>{rev.cleanlinessRating}/5</strong></span>
                          )}
                          {rev.communicationRating && (
                            <span>Communication: <strong>{rev.communicationRating}/5</strong></span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
