import { useApp } from "../context/AppContext";
import { ChefHat } from "lucide-react";

interface NavbarProps {
  currentPage: string;
  setPage: (page: string) => void;
}

export default function Navbar({ currentPage, setPage }: NavbarProps) {
  const { currentUser, logout, resetAppDatabase } = useApp();

  const handleNavClick = (page: string) => {
    setPage(page);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 border-b border-gray-150/10 backdrop-blur-md shadow-2xs">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo - Designed strictly with Sleek Green & White */}
        <button
          onClick={() => setPage("home")}
          className="flex items-center gap-3 group text-left cursor-pointer transition-transform duration-200 active:scale-95"
          id="nav-logo"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-200 group-hover:bg-emerald-700 transition-all">
            <ChefHat className="w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5 font-display">
              ChefDoor
            </h1>
            <p className="text-[9px] text-slate-400 tracking-wider font-extrabold uppercase font-mono">HYGIENIC • COMPLIANT • SECURE</p>
          </div>
        </button>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center gap-2">
          {/* Public links always visible */}
          <button
            onClick={() => handleNavClick("home")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              currentPage === "home"
                ? "bg-emerald-50 text-emerald-700 font-semibold"
                : "text-emerald-800 hover:bg-emerald-50/50"
            }`}
            id="nav-home"
          >
            Home
          </button>

          <button
            onClick={() => handleNavClick("browse")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              currentPage === "browse" || currentPage === "chef-profile"
                ? "bg-emerald-50 text-emerald-700 font-semibold"
                : "text-emerald-800 hover:bg-emerald-50/50"
            }`}
            id="nav-browse"
          >
            Browse Chefs
          </button>

          <button
            onClick={() => handleNavClick("about")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              currentPage === "about"
                ? "bg-emerald-50 text-emerald-700 font-semibold"
                : "text-emerald-800 hover:bg-emerald-50/50"
            }`}
            id="nav-about"
          >
            About Marketplace
          </button>

          {/* Conditional Navigation based on User vs Chef roles */}
          {currentUser && currentUser.role === "User" && (
            <button
              onClick={() => handleNavClick("bookings")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                currentPage === "bookings" || currentPage === "payment"
                  ? "bg-emerald-50 text-emerald-700 font-semibold"
                  : "text-emerald-800 hover:bg-emerald-50/50"
              }`}
              id="nav-bookings"
            >
              My Bookings
            </button>
          )}

          {/* Conditional Navigation for Chef Partners */}
          {currentUser && currentUser.role === "Chef" && (
            <button
              onClick={() => handleNavClick("chef-dashboard")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                currentPage === "chef-dashboard"
                  ? "bg-emerald-50 text-emerald-700 font-semibold"
                  : "text-emerald-800 hover:bg-emerald-50/50"
              }`}
              id="nav-chef-dashboard"
            >
              Chef Dashboard
            </button>
          )}
        </nav>

        {/* Action Buttons (Login, Register & State switcher) */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex flex-col text-right justify-center">
                <p className="text-xs font-bold text-slate-755 leading-none">
                  {currentUser.name}
                </p>
              </div>

              {/* Dynamic circular profile monogram with clean design */}
              <button
                onClick={() => handleNavClick("profile")}
                className="w-10 h-10 rounded-full bg-emerald-50 border-2 border-white shadow-sm hover:border-emerald-300 transition-all flex items-center justify-center text-emerald-700 font-bold text-xs cursor-pointer uppercase"
                title="Go to Account Profile"
              >
                {currentUser.name.substring(0, 2)}
              </button>

              <button
                onClick={() => {
                  logout();
                  setPage("home");
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold bg-white border border-rose-200 text-rose-605 hover:bg-rose-50/50 active:scale-95 transition-all cursor-pointer"
                id="nav-logout"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavClick("login")}
                className="px-4 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50/50 rounded-xl transition-all cursor-pointer"
                id="nav-login-btn"
              >
                Login
              </button>
              <button
                onClick={() => handleNavClick("register")}
                className="px-4 py-2 text-xs font-semibold bg-emerald-600 text-white shadow-sm shadow-emerald-200 hover:bg-emerald-700 rounded-xl transition-all cursor-pointer"
                id="nav-register-btn"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav Drawer Trigger Banner (Simple bottom helper or auto indicator for responsive) */}
      <div className="md:hidden flex items-center justify-around bg-emerald-50 border-t border-emerald-100 py-2.5 px-4 font-sans text-[10px]">
        <button
          onClick={() => handleNavClick("home")}
          className={`flex flex-col items-center gap-0.5 font-semibold ${currentPage === "home" ? "text-emerald-700" : "text-emerald-600/70"}`}
        >
          <span>Home</span>
        </button>
        <button
          onClick={() => handleNavClick("browse")}
          className={`flex flex-col items-center gap-0.5 font-semibold ${currentPage === "browse" ? "text-emerald-700" : "text-emerald-600/70"}`}
        >
          <span>Browse</span>
        </button>
        {currentUser ? (
          currentUser.role === "User" ? (
            <button
              onClick={() => handleNavClick("bookings")}
              className={`flex flex-col items-center gap-0.5 font-semibold ${currentPage === "bookings" ? "text-emerald-700" : "text-emerald-600/70"}`}
            >
              <span>Bookings</span>
            </button>
          ) : (
            <button
              onClick={() => handleNavClick("chef-dashboard")}
              className={`flex flex-col items-center gap-0.5 font-semibold ${currentPage === "chef-dashboard" ? "text-emerald-700" : "text-emerald-600/70"}`}
            >
              <span>Dashboard</span>
            </button>
          )
        ) : (
          <button
            onClick={() => handleNavClick("login")}
            className="flex flex-col items-center gap-0.5 font-semibold text-emerald-600/70"
          >
            <span>Login</span>
          </button>
        )}
        <button
          onClick={() => handleNavClick("about")}
          className={`flex flex-col items-center gap-0.5 font-semibold ${currentPage === "about" ? "text-emerald-700" : "text-emerald-600/70"}`}
        >
          <span>About</span>
        </button>
      </div>
    </header>
  );
}
