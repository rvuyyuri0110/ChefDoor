/**
 * ChefDoor - Main Application Entry Router
 * Designed to be easy for 4th graders and students.
 * Exclusively Green & White aesthetics.
 */

import { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import BrowseChefs from "./pages/BrowseChefs";
import ChefProfile from "./pages/ChefProfile";
import MyBookings from "./pages/MyBookings";
import PaymentPage from "./pages/PaymentPage";
import ChefDashboard from "./pages/ChefDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import UserProfile from "./pages/UserProfile";
import { X, Sparkles, Bell, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Booking } from "./types";

function AppContent() {
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [selectedChefId, setSelectedChefId] = useState<string | null>(null);
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState<Booking | null>(null);

  const { chefs, notifications, removeToast, currentUser } = useApp();

  // Route back and change pages
  const handleSelectChef = (chefId: string) => {
    setSelectedChefId(chefId);
    setCurrentPage("chef-profile");
  };

  const handleBookSuccessRedirect = () => {
    setCurrentPage("bookings");
  };

  const handleGoToPayment = (booking: Booking) => {
    setSelectedBookingForPayment(booking);
    setCurrentPage("payment");
  };

  const handlePaymentSuccessRedirect = () => {
    setSelectedBookingForPayment(null);
    setCurrentPage("bookings");
  };

  // Main Page Router switch statement
  const renderActivePage = () => {
    switch (currentPage) {
      case "home":
        return <Home chefs={chefs} onSelectChef={handleSelectChef} setPage={setCurrentPage} />;
      
      case "browse":
        return <BrowseChefs chefs={chefs} onSelectChef={handleSelectChef} />;
      
      case "chef-profile":
        const chef = chefs.find(c => c.id === selectedChefId);
        if (!chef) {
          return (
            <div className="text-center py-20">
              <span className="text-4xl text-slate-300">🤷‍♂️</span>
              <p className="text-xs text-slate-400 mt-2">Chef profile not found.</p>
              <button onClick={() => setCurrentPage("browse")} className="text-xs font-bold text-emerald-600 underline mt-4">Back to browse</button>
            </div>
          );
        }
        return (
          <ChefProfile 
            chef={chef} 
            onBack={() => setCurrentPage("browse")} 
            onBookSuccess={handleBookSuccessRedirect} 
            setPage={setCurrentPage}
            setSelectedChefId={setSelectedChefId}
          />
        );
      
      case "bookings":
        return <MyBookings onGoToPayment={handleGoToPayment} />;
      
      case "payment":
        if (!selectedBookingForPayment) {
          return (
            <div className="text-center py-20">
              <p className="text-xs text-slate-400">No active booking selected for checkout.</p>
              <button onClick={() => setCurrentPage("bookings")} className="text-xs font-bold text-emerald-600 underline mt-4">Back to bookings</button>
            </div>
          );
        }
        return (
          <PaymentPage 
            booking={selectedBookingForPayment} 
            onBack={() => setCurrentPage("bookings")} 
            onSuccess={handlePaymentSuccessRedirect} 
          />
        );
      
      case "chef-dashboard":
        return <ChefDashboard />;
      
      case "login":
        return (
          <Login 
            onSuccess={() => setCurrentPage("home")} 
            onGoToRegister={() => setCurrentPage("register")} 
          />
        );
      
      case "register":
        return (
          <Register 
            onSuccess={() => setCurrentPage("home")} 
            onGoToLogin={() => setCurrentPage("login")} 
          />
        );
      
      case "about":
        return <About />;
      
      case "profile":
        return <UserProfile />;

      default:
        return <Home chefs={chefs} onSelectChef={handleSelectChef} setPage={setCurrentPage} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-emerald-200">
      
      {/* Top Navigation Bar with Green & White theme */}
      <Navbar currentPage={currentPage} setPage={setCurrentPage} />

      {/* Main Container with subtle Apple-like fade page transition */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage + (selectedChefId || "")}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            id="page-wrapper"
          >
            {renderActivePage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Clean full-width green/white footer */}
      <Footer setPage={setCurrentPage} />

      {/* Clean Bottom Notification Toasts Panel (Implements Part 11: Real-time user/chef updates) */}
      <div 
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-3.5 max-w-sm w-full pointer-events-none"
        id="notification-panel"
      >
        <AnimatePresence>
          {notifications.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="pointer-events-auto bg-emerald-990 border border-emerald-800 text-white rounded-2xl p-4.5 shadow-xl shadow-emerald-950/20 flex gap-3 items-start relative overflow-hidden"
              id={`toast-${toast.id}`}
            >
              {/* Background ambient light */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-800/20 to-transparent pointer-events-none" />
              
              <div className="text-xl flex-shrink-0">
                {toast.type === "success" ? "🎉" : toast.type === "warning" ? "⚠️" : "🔔"}
              </div>

              <div className="flex-1 space-y-1">
                <p className="text-xs font-bold leading-relaxed">{toast.message}</p>
                <span className="block text-[9px] text-emerald-300/80 font-mono font-medium">{toast.timestamp}</span>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-emerald-400 hover:text-white transition-colors cursor-pointer"
                id={`toast-close-${toast.id}`}
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
