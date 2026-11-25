import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { ShieldCheck, CheckCircle2, Clock, AlertTriangle, Star, Home, ArrowRight } from 'lucide-react';

export default function StayTimeline({ stay, onRefresh, onOpenReviewModal, onSelectUser }) {
  const { user } = useAuth();
  const [loadingAction, setLoadingAction] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const isTenant = user?.id === stay.tenant?.id;
  const isOwner = user?.id === stay.owner?.id;

  const handleConfirmMoveIn = async () => {
    setLoadingAction(true);
    setErrorMsg(null);
    try {
      await api.confirmMoveIn(stay.id);
      if (onRefresh) onRefresh();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to confirm move-in');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleConfirmMoveOut = async () => {
    setLoadingAction(true);
    setErrorMsg(null);
    try {
      await api.confirmMoveOut(stay.id);
      if (onRefresh) onRefresh();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to confirm move-out');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDispute = async () => {
    const reason = prompt('Please enter the reason for this dispute:');
    if (!reason) return;
    setLoadingAction(true);
    try {
      await api.disputeStay(stay.id, reason);
      if (onRefresh) onRefresh();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to dispute stay');
    } finally {
      setLoadingAction(false);
    }
  };

  // Determine active step
  const getStepIndex = () => {
    switch (stay.status) {
      case 'REQUESTED': return 0;
      case 'ACCEPTED': return 1;
      case 'ACTIVE': return 2;
      case 'COMPLETED': return 3;
      default: return 1;
    }
  };

  const currentStep = getStepIndex();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-sm">
              Stay Agreement #{stay.id}
            </span>
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
              stay.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
              stay.status === 'ACTIVE' ? 'bg-blue-100 text-blue-800' :
              stay.status === 'DISPUTED' ? 'bg-red-100 text-red-800' :
              'bg-amber-100 text-amber-800'
            }`}>
              {stay.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {stay.property?.title} • {stay.property?.city}
          </p>
        </div>

        <div className="text-right text-xs space-y-0.5">
          <p className="text-slate-500">
            Tenant:{' '}
            <button
              type="button"
              onClick={() => onSelectUser && onSelectUser(stay.tenant?.id)}
              className="font-semibold text-slate-800 hover:text-emerald-700 underline"
            >
              {stay.tenant?.fullName} (Reviews)
            </button>
          </p>
          <p className="text-slate-500">
            Owner:{' '}
            <button
              type="button"
              onClick={() => onSelectUser && onSelectUser(stay.owner?.id)}
              className="font-semibold text-slate-800 hover:text-emerald-700 underline"
            >
              {stay.owner?.fullName} (Reviews)
            </button>
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Visual Stepper */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        <div className={`p-2 rounded-xl border ${currentStep >= 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
          <div className="text-[10px] uppercase tracking-wider text-slate-400">Step 1</div>
          Requested
        </div>
        <div className={`p-2 rounded-xl border ${currentStep >= 1 ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
          <div className="text-[10px] uppercase tracking-wider text-slate-400">Step 2</div>
          Accepted
        </div>
        <div className={`p-2 rounded-xl border ${currentStep >= 2 ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
          <div className="text-[10px] uppercase tracking-wider text-slate-400">Step 3</div>
          Active Stay
        </div>
        <div className={`p-2 rounded-xl border ${currentStep >= 3 ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
          <div className="text-[10px] uppercase tracking-wider text-slate-400">Step 4</div>
          Completed
        </div>
      </div>

      {/* Dual Confirmation Statuses */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs grid grid-cols-2 gap-3">
        <div>
          <p className="font-semibold text-slate-700 mb-1">Move-In Confirmations</p>
          <div className="space-y-0.5 text-slate-500">
            <p>Tenant: {stay.tenantConfirmedMoveIn ? '✅ Confirmed' : '⏳ Pending'}</p>
            <p>Owner: {stay.ownerConfirmedMoveIn ? '✅ Confirmed' : '⏳ Pending'}</p>
          </div>
        </div>
        <div>
          <p className="font-semibold text-slate-700 mb-1">Move-Out Confirmations</p>
          <div className="space-y-0.5 text-slate-500">
            <p>Tenant: {stay.tenantConfirmedMoveOut ? '✅ Confirmed' : '⏳ Pending'}</p>
            <p>Owner: {stay.ownerConfirmedMoveOut ? '✅ Confirmed' : '⏳ Pending'}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          {stay.status === 'ACCEPTED' && (
            <button
              onClick={handleConfirmMoveIn}
              disabled={loadingAction || (isTenant && stay.tenantConfirmedMoveIn) || (isOwner && stay.ownerConfirmedMoveIn)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50"
            >
              {loadingAction ? 'Processing...' : 'Confirm Move-In'}
            </button>
          )}

          {stay.status === 'ACTIVE' && (
            <button
              onClick={handleConfirmMoveOut}
              disabled={loadingAction || (isTenant && stay.tenantConfirmedMoveOut) || (isOwner && stay.ownerConfirmedMoveOut)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50"
            >
              {loadingAction ? 'Processing...' : 'Confirm Move-Out'}
            </button>
          )}

          {stay.status === 'COMPLETED' && (
            <button
              onClick={() => onOpenReviewModal(stay)}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              Write Verified Review
            </button>
          )}
        </div>

        {stay.status !== 'COMPLETED' && stay.status !== 'DISPUTED' && (
          <button
            onClick={handleDispute}
            disabled={loadingAction}
            className="text-xs text-red-600 hover:text-red-700 font-medium hover:underline flex items-center gap-1"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Report Conflict / Dispute
          </button>
        )}
      </div>

    </div>
  );
}
