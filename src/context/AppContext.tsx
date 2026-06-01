import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Chef, Booking } from "../types";

interface Notification {
  id: string;
  message: string;
  type: "success" | "info" | "warning";
  timestamp: string;
}

interface AppContextType {
  currentUser: User | null;
  currentChefProfile: Chef | null;
  chefs: Chef[];
  bookings: Booking[];
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (payload: any) => Promise<boolean>;
  logout: () => void;
  fetchChefs: () => Promise<void>;
  updateChefProfile: (chefId: string, updatedData: any) => Promise<boolean>;
  fetchBookings: () => Promise<void>;
  createBooking: (bookingPayload: any) => Promise<boolean>;
  updateBookingStatus: (bookingId: string, status: Booking["status"]) => Promise<boolean>;
  submitPayment: (bookingId: string, method: "UPI" | "Cash") => Promise<boolean>;
  submitChefRating: (bookingId: string, rating: number, comment: string) => Promise<boolean>;
  addToast: (message: string, type?: "success" | "info" | "warning") => void;
  removeToast: (id: string) => void;
  resetAppDatabase: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentChefProfile, setCurrentChefProfile] = useState<Chef | null>(null);
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Auth session from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("chefdoor_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
      } catch (e) {
        localStorage.removeItem("chefdoor_user");
      }
    }
    fetchChefs();
  }, []);

  // Fetch chef profile if user is a Chef
  useEffect(() => {
    if (currentUser && currentUser.role === "Chef" && currentUser.chefProfileId) {
      const matchedProfile = chefs.find(c => c.id === currentUser.chefProfileId);
      if (matchedProfile) {
        setCurrentChefProfile(matchedProfile);
      } else {
        // Fetch individually
        fetch(`/api/chefs/${currentUser.chefProfileId}`)
          .then(res => res.json())
          .then(data => {
            if (!data.error) {
              setCurrentChefProfile(data);
            }
          });
      }
      fetchBookings();
    } else if (currentUser && currentUser.role === "User") {
      fetchBookings();
    } else {
      setBookings([]);
      setCurrentChefProfile(null);
    }
  }, [currentUser, chefs]);

  // Polling bookings every 5 seconds to simulate real-time notifications for 4th graders!
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentUser) {
      interval = setInterval(() => {
        pollBookingsAndNotify();
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentUser, bookings]);

  const addToast = (message: string, type: "success" | "info" | "warning" = "success") => {
    const id = "nt-" + Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [
      { id, message, type, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ...prev
    ]);
  };

  const removeToast = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const fetchChefs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/chefs");
      const data = await res.json();
      if (res.ok) {
        setChefs(data);
      } else {
        setError(data.error || "Failed to load Chefs");
      }
    } catch (e) {
      setError("Server connection issue");
    } finally {
      setLoading(false);
    }
  };

  const pollBookingsAndNotify = async () => {
    if (!currentUser) return;
    try {
      const url = currentUser.role === "User" 
        ? `/api/bookings?userId=${currentUser.id}` 
        : `/api/bookings?chefId=${currentUser.chefProfileId}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        // Compare with old bookings locally to spawn nice notifications
        if (bookings.length > 0) {
          data.forEach((newB: Booking) => {
            const oldB = bookings.find(b => b.id === newB.id);
            if (oldB) {
              // Notification 1: Chef accepted booking
              if (oldB.status === "Pending" && newB.status === "Accepted" && currentUser.role === "User") {
                addToast(`🎉 Good News! Chef ${newB.chefName} accepted your booking!`, "success");
              }
              // Notification 2: Chef rejected booking
              if (oldB.status === "Pending" && newB.status === "Rejected" && currentUser.role === "User") {
                addToast(`😔 Oh no, Chef ${newB.chefName} could not join today. Try another friendly chef!`, "warning");
              }
            } else {
              // Notification 3: New booking request for Chef
              if (currentUser.role === "Chef") {
                addToast(`🔔 Hooray! You have a new booking request from ${newB.userName}!`, "info");
              }
            }
          });
        }
        setBookings(data);
      }
    } catch (e) {
      // Slant errors
    }
  };

  const fetchBookings = async () => {
    if (!currentUser) return;
    try {
      const url = currentUser.role === "User" 
        ? `/api/bookings?userId=${currentUser.id}` 
        : `/api/bookings?chefId=${currentUser.chefProfileId}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setBookings(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        localStorage.setItem("chefdoor_user", JSON.stringify(data.user));
        addToast(`😋 Welcome back, ${data.user.name}! Ready to explore yummy dishes?`, "success");
        return true;
      } else {
        setError(data.error || "Login Failed");
        return false;
      }
    } catch (e) {
      setError("Could not connect to database");
      return false;
    }
  };

  const register = async (payload: any): Promise<boolean> => {
    try {
      setError(null);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        localStorage.setItem("chefdoor_user", JSON.stringify(data.user));
        addToast(`🎈 Welcome aboard, ${data.user.name}! Your account is created!`, "success");
        await fetchChefs();
        return true;
      } else {
        setError(data.error || "Registration failed");
        return false;
      }
    } catch (e) {
      setError("Could not connect to database");
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentChefProfile(null);
    setBookings([]);
    localStorage.removeItem("chefdoor_user");
    addToast("🏠 Successfully logged out. Keep cooking!", "info");
  };

  const updateChefProfile = async (chefId: string, updatedData: any): Promise<boolean> => {
    try {
      const res = await fetch(`/api/chefs/${chefId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentChefProfile(data);
        await fetchChefs();
        addToast("✨ Your professional cooking chef profile has been updated!", "success");
        return true;
      } else {
        setError(data.error || "Failed to update profile");
        return false;
      }
    } catch (e) {
      setError("Failed to reach server");
      return false;
    }
  };

  const createBooking = async (bookingPayload: any): Promise<boolean> => {
    try {
      setError(null);
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload)
      });
      const data = await res.json();
      if (res.ok) {
        addToast("💌 Cooking request sent! Waiting for your Chef to reply.", "success");
        await fetchBookings();
        return true;
      } else {
        setError(data.error || "Could not book chef");
        return false;
      }
    } catch (e) {
      setError("Server connection error");
      return false;
    }
  };

  const updateBookingStatus = async (bookingId: string, status: Booking["status"]): Promise<boolean> => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        await fetchBookings();
        if (status === "Accepted") {
          addToast("✅ You Accepted this food quest order!", "success");
        } else if (status === "Rejected") {
          addToast("❌ Order is Rejected.", "warning");
        } else if (status === "Completed") {
          addToast("🎉 Cooking quest completed successfully!", "success");
        }
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const submitPayment = async (bookingId: string, method: "UPI" | "Cash"): Promise<boolean> => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethod: method, paymentStatus: "Paid" })
      });
      if (res.ok) {
        await fetchBookings();
        addToast("💰 Payment approved! Food magic is locked in.", "success");
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const submitChefRating = async (bookingId: string, rating: number, comment: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment })
      });
      if (res.ok) {
        await fetchBookings();
        await fetchChefs();
        addToast("⭐ Thank you! Your review helps build the food community.", "success");
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const resetAppDatabase = async () => {
    try {
      const res = await fetch("/api/seed/reset", { method: "POST" });
      if (res.ok) {
        addToast("⚙️ Database re-initialized to default students sample data!", "info");
        // Reload all
        setCurrentUser(null);
        setCurrentChefProfile(null);
        localStorage.removeItem("chefdoor_user");
        await fetchChefs();
        setBookings([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentChefProfile,
        chefs,
        bookings,
        notifications,
        loading,
        error,
        login,
        register,
        logout,
        fetchChefs,
        updateChefProfile,
        fetchBookings,
        createBooking,
        updateBookingStatus,
        submitPayment,
        submitChefRating,
        addToast,
        removeToast,
        resetAppDatabase
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used inside an AppProvider");
  }
  return context;
}
