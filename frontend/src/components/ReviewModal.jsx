import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { X, Star, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';

export default function ReviewModal({ stay, onClose, onReviewSubmitted }) {
  const { user } = useAuth();
  const isTenant = user?.id === stay.tenant?.id;

  const [targetType, setTargetType] = useState(isTenant ? 'PROPERTY' : 'TENANT');
  const [rating, setRating] = useState(5);
  const [cleanlinessRating, setCleanlinessRating] = useState(5);
  const [communicationRating, setCommunicationRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.submitReview(stay.id, {
        targetType,
        rating,
        cleanlinessRating,
        communicationRating,
        title,
        comment,
      });
      if (onReviewSubmitted) onReviewSubmitted();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const renderStarInput = (val, setVal) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => setVal(star)}
            className={`text-xl transition ${star <= val ? 'text-amber-500' : 'text-slate-300 hover:text-amber-300'}`}
          >
            ★
          </button>
        ))}
        <span className="text-xs text-slate-500 ml-2 font-semibold">{val} / 5</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Write Verified Stay Review</h3>
              <p className="text-[11px] text-slate-400">Stay agreement #{stay.id} • Verified Occupancy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isTenant ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">What are you reviewing?</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetType('PROPERTY')}
                  className={`p-2 rounded-xl text-xs font-semibold border text-center transition ${
                    targetType === 'PROPERTY' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Property ({stay.property?.title})
                </button>
                <button
                  type="button"
                  onClick={() => setTargetType('OWNER')}
                  className={`p-2 rounded-xl text-xs font-semibold border text-center transition ${
                    targetType === 'OWNER' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Owner ({stay.owner?.fullName})
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-600">
              Reviewing Tenant: <span className="font-semibold text-slate-800">{stay.tenant?.fullName}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Overall Rating</label>
            {renderStarInput(rating, setRating)}
          </div>

          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Cleanliness</label>
              {renderStarInput(cleanlinessRating, setCleanlinessRating)}
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Communication</label>
              {renderStarInput(communicationRating, setCommunicationRating)}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Review Headline</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Great bachelor-friendly landlord, smooth stay"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Feedback</label>
            <textarea
              rows="3"
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share honest experience regarding housing condition, rent transparency, maintenance, etc."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition shadow-sm disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Post Verified Review'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
