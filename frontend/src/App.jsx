import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PropertyDetailModal from './components/PropertyDetailModal';
import NewPropertyModal from './components/NewPropertyModal';
import ReviewModal from './components/ReviewModal';
import UserProfileModal from './components/UserProfileModal';

function MainApp() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedStayForReview, setSelectedStayForReview] = useState(null);
  const [selectedUserIdForProfile, setSelectedUserIdForProfile] = useState(null);
  const [isNewPropertyModalOpen, setIsNewPropertyModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onOpenNewPropertyModal={() => setIsNewPropertyModalOpen(true)}
      />

      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onSelectProperty={setSelectedProperty}
          />
        )}

        {currentPage === 'dashboard' && (
          user ? (
            <DashboardPage
              onOpenReviewModal={setSelectedStayForReview}
              onOpenNewPropertyModal={() => setIsNewPropertyModalOpen(true)}
              onSelectUser={setSelectedUserIdForProfile}
            />
          ) : (
            <LoginPage onNavigate={setCurrentPage} />
          )
        )}

        {currentPage === 'login' && (
          <LoginPage onNavigate={setCurrentPage} />
        )}

        {currentPage === 'register' && (
          <RegisterPage onNavigate={setCurrentPage} />
        )}
      </main>

      {/* Property Details Modal */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onSelectUser={setSelectedUserIdForProfile}
          onConnectionSent={() => {
            // Optional callback
          }}
        />
      )}

      {/* New Property Listing Modal (Owners only) */}
      {isNewPropertyModalOpen && (
        <NewPropertyModal
          onClose={() => setIsNewPropertyModalOpen(false)}
          onCreated={() => {
            // Refresh
          }}
        />
      )}

      {/* Verified Stay Review Modal */}
      {selectedStayForReview && (
        <ReviewModal
          stay={selectedStayForReview}
          onClose={() => setSelectedStayForReview(null)}
          onReviewSubmitted={() => {
            // Callback
          }}
        />
      )}

      {/* User Profile & Verified Reviews Modal */}
      {selectedUserIdForProfile && (
        <UserProfileModal
          userId={selectedUserIdForProfile}
          onClose={() => setSelectedUserIdForProfile(null)}
        />
      )}

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p className="font-medium text-slate-700">FindMyHome • The Verified Rental & Stay Platform</p>
        <p className="mt-1 text-[11px] text-slate-400">
          Built with Spring Boot 3, Java 21, JPA, Spring Security, JWT, PostgreSQL, and React.
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
