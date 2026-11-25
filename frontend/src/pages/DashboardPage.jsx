import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import StayTimeline from '../components/StayTimeline';
import { LayoutDashboard, Users, Home, Clock, CheckCircle2, XCircle, PlusCircle, AlertCircle, Phone, Mail, Star } from 'lucide-react';

export default function DashboardPage({ onOpenReviewModal, onOpenNewPropertyModal, onSelectUser }) {
  const { user, isOwner } = useAuth();
  const [activeTab, setActiveTab] = useState('stays');
  
  const [stays, setStays] = useState([]);
  const [connections, setConnections] = useState([]);
  const [myProperties, setMyProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal for creating a stay from an accepted connection
  const [selectedConnectionForStay, setSelectedConnectionForStay] = useState(null);
  const [stayStartDate, setStayStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [creatingStay, setCreatingStay] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [staysData, connData] = await Promise.all([
        api.getMyStays().catch(() => []),
        isOwner ? api.getIncomingConnections().catch(() => []) : api.getOutgoingConnections().catch(() => []),
      ]);
      setStays(staysData || []);
      setConnections(connData || []);

      if (isOwner) {
        const props = await api.getMyProperties().catch(() => []);
        setMyProperties(props || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isOwner]);

  const handleAcceptConnection = async (id) => {
    try {
      await api.acceptConnection(id);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to accept connection');
    }
  };

  const handleRejectConnection = async (id) => {
    try {
      await api.rejectConnection(id);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to reject connection');
    }
  };

  const handleCreateStaySubmit = async (e) => {
    e.preventDefault();
    if (!selectedConnectionForStay) return;
    setCreatingStay(true);

    try {
      await api.createStay({
        propertyId: selectedConnectionForStay.property.id,
        tenantId: selectedConnectionForStay.tenant.id,
        startDate: stayStartDate,
      });
      setSelectedConnectionForStay(null);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to create stay agreement');
    } finally {
      setCreatingStay(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header Profile Summary */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-emerald-200">
            {user?.fullName ? user.fullName[0].toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{user?.fullName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                {user?.verificationStatus}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isOwner ? 'Property Owner' : 'Tenant'} • {user?.email} • {user?.phoneNumber}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isOwner && (
            <button
              onClick={onOpenNewPropertyModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
            >
              <PlusCircle className="w-4 h-4" />
              Add New Property
            </button>
          )}

          <button
            onClick={() => onSelectUser && onSelectUser(user?.id)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition"
          >
            <Star className="w-4 h-4 text-amber-500 fill-current" />
            My Reputation & Reviews
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('stays')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'stays' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Verified Stays ({stays.length})
        </button>

        <button
          onClick={() => setActiveTab('connections')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'connections' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {isOwner ? 'Incoming Connection Requests' : 'My Connection Requests'} ({connections.length})
        </button>

        {isOwner && (
          <button
            onClick={() => setActiveTab('properties')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'properties' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            My Listings ({myProperties.length})
          </button>
        )}
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <p className="text-xs text-slate-400">Loading your data...</p>
        </div>
      ) : (
        <div>
          {/* Stays Tab */}
          {activeTab === 'stays' && (
            <div className="space-y-4">
              {stays.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
                  <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">No active or historical stays</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Stays begin once a connection request is accepted and move-in is confirmed.
                  </p>
                </div>
              ) : (
                stays.map((stay) => (
                  <StayTimeline
                    key={stay.id}
                    stay={stay}
                    onRefresh={fetchData}
                    onOpenReviewModal={onOpenReviewModal}
                    onSelectUser={onSelectUser}
                  />
                ))
              )}
            </div>
          )}

          {/* Connections Tab */}
          {activeTab === 'connections' && (
            <div className="space-y-4">
              {connections.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
                  <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">No connection requests yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {connections.map((conn) => (
                    <div key={conn.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {conn.property?.title}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Requested by{' '}
                            <button
                              type="button"
                              onClick={() => onSelectUser && onSelectUser(conn.tenant?.id)}
                              className="font-semibold text-slate-700 hover:text-emerald-700 underline"
                            >
                              {conn.tenant?.fullName} (View Reviews)
                            </button>
                          </span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          conn.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                          conn.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {conn.status}
                        </span>
                      </div>

                      {conn.message && (
                        <p className="bg-slate-50 p-2.5 rounded-xl text-slate-600 italic border border-slate-100">
                          "{conn.message}"
                        </p>
                      )}

                      {/* Contact Info (Unlocked if Accepted) */}
                      {conn.status === 'ACCEPTED' && (
                        <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-1">
                          <p className="font-semibold text-emerald-950 text-[11px]">Contact Information Unlocked:</p>
                          <div className="flex items-center gap-3 text-slate-700">
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-emerald-600" /> {conn.tenant?.phoneNumber}</span>
                            <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-emerald-600" /> {conn.tenant?.email}</span>
                          </div>
                        </div>
                      )}

                      {/* Owner Action Buttons */}
                      {isOwner && conn.status === 'PENDING' && (
                        <div className="flex gap-2 pt-2 border-t border-slate-100">
                          <button
                            onClick={() => handleAcceptConnection(conn.id)}
                            className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition"
                          >
                            Accept Connection
                          </button>
                          <button
                            onClick={() => handleRejectConnection(conn.id)}
                            className="px-3 py-1.5 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition"
                          >
                            Decline
                          </button>
                        </div>
                      )}

                      {/* Owner can start stay for accepted connection */}
                      {isOwner && conn.status === 'ACCEPTED' && (
                        <div className="pt-2 border-t border-slate-100">
                          <button
                            onClick={() => setSelectedConnectionForStay(conn)}
                            className="w-full py-1.5 bg-slate-900 hover:bg-black text-white rounded-xl font-semibold transition flex items-center justify-center gap-1"
                          >
                            <Home className="w-3.5 h-3.5" />
                            Create Stay Agreement
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Properties Tab (Owner only) */}
          {activeTab === 'properties' && isOwner && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myProperties.map((prop) => (
                  <div key={prop.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900 text-sm">{prop.title}</h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {prop.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{prop.addressLine}, {prop.city}</p>
                      <p className="text-sm font-bold text-emerald-700 mt-2">
                        ₹{prop.rentAmount} / month
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal: Create Stay Agreement */}
      {selectedConnectionForStay && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Create Stay Agreement</h3>
            <p className="text-xs text-slate-500">
              Formally initiate the stay for <span className="font-semibold text-slate-800">{selectedConnectionForStay.tenant?.fullName}</span> at <span className="font-semibold text-slate-800">{selectedConnectionForStay.property?.title}</span>.
            </p>

            <form onSubmit={handleCreateStaySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Move-in Start Date</label>
                <input
                  type="date"
                  required
                  value={stayStartDate}
                  onChange={(e) => setStayStartDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedConnectionForStay(null)}
                  className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingStay}
                  className="px-5 py-2 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl disabled:opacity-50"
                >
                  {creatingStay ? 'Creating...' : 'Initiate Agreement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
