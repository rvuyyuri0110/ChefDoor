import React, { useState } from "react";
import { Chef } from "../types";
import { useApp } from "../context/AppContext";

interface ChefProfileProps {
  chef: Chef;
  onBack: () => void;
  onBookSuccess: () => void;
  setPage: (page: string) => void;
  setSelectedChefId: (id: string | null) => void;
}

export default function ChefProfile({ chef, onBack, onBookSuccess, setPage, setSelectedChefId }: ChefProfileProps) {
  const { currentUser, createBooking, addToast } = useApp();
  const [hasFallbackFailed, setHasFallbackFailed] = useState(false);

  const isFemale = chef.name.toLowerCase().includes("priya") || 
                   chef.name.toLowerCase().includes("kavitha") || 
                   chef.name.toLowerCase().includes("maya") || 
                   chef.name.toLowerCase().includes("nair") ||
                   chef.name.toLowerCase().includes("reddy");

  const getFallbackImgUrl = () => {
    return isFemale
      ? "https://images.unsplash.com/photo-1574085733277-851d9d856a3a?w=400&auto=format&fit=crop&q=80"
      : "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80";
  };

  // Booking Form Fields
  const [cookingType, setCookingType] = useState("Premium Multi-course Family Feast");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("17:00");
  const [duration, setDuration] = useState(2);
  const [address, setAddress] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [loading, setLoading] = useState(false);

  // Compute live price
  const totalPrice = duration * chef.pricePerHour;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      addToast("🔑 Please Sign In or Sign Up first to send a booking request!", "warning");
      setPage("login");
      return;
    }

    if (currentUser.role === "Chef") {
      addToast("👩‍🍳 Chefs cannot book other chefs! Sign in with a custom User account.", "warning");
      return;
    }

    if (!date || !address.trim() || !cookingType.trim() || !startTime) {
      addToast("⚠️ Please fill in all the details in the simple form!", "warning");
      return;
    }

    setLoading(true);
    const success = await createBooking({
      userId: currentUser.id,
      userName: currentUser.name,
      chefId: chef.id,
      chefName: chef.name,
      cookingType,
      date,
      startTime,
      duration,
      address,
      specialInstructions,
      totalPrice
    });

    setLoading(false);
    if (success) {
      onBookSuccess();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 mb-8 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors uppercase tracking-wider cursor-pointer font-sans"
        id="profile-back-btn"
      >
        <span>← Back To Chef Listings</span>
      </button>

      {/* Two Column Layout: Left (Info & Reviews), Right (Booking Form) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column (Info) */}
        <div className="lg:col-span-7 space-y-10">
          
          {/* Main Card */}
          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden p-8 flex flex-col sm:flex-row gap-8 shadow-xs">
            {/* Round Avatar and basic metadata */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-emerald-50 overflow-hidden flex-shrink-0 border-2 border-slate-100 shadow-2xs mx-auto sm:mx-0 flex items-center justify-center">
              {hasFallbackFailed ? (
                <div className={`w-full h-full bg-gradient-to-br ${
                  isFemale 
                    ? "from-rose-100/50 to-orange-50/80" 
                    : "from-emerald-150/50 to-teal-50"
                } flex flex-col items-center justify-center p-3 text-center select-none`}>
                  <span className="text-2xl font-black text-emerald-800">
                    {chef.name.split(" ").filter(n => n.toLowerCase() !== "chef").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mt-1">
                    {isFemale ? "Female" : "Male"}
                  </span>
                </div>
              ) : (
                <img 
                  src={chef.photoUrl} 
                  alt={chef.name}
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const imgTarget = e.currentTarget;
                    const fallbackUrl = getFallbackImgUrl();
                    if (imgTarget.src === fallbackUrl) {
                      setHasFallbackFailed(true);
                    } else {
                      imgTarget.src = fallbackUrl;
                    }
                  }}
                />
              )}
            </div>

            <div className="space-y-4 flex-1 text-center sm:text-left">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">{chef.name}</h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  {/* Rating */}
                  <div className="flex items-center gap-1 bg-emerald-50 text-emerald-805 px-2.5 py-1 rounded-lg text-xs font-bold border border-emerald-100/50">
                    <span>★ {chef.rating.toFixed(1)} Stars</span>
                  </div>
                  {/* Experience */}
                  <span className="text-xs text-slate-500 font-bold">
                    {chef.experience} Years Active Industry Experience
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 font-semibold">
                <p>
                  <span className="text-emerald-705 font-bold">📍 Active Area:</span> {chef.serviceArea}
                </p>
                <p>
                  <span className="text-emerald-705 font-bold">💸 Rate:</span> ₹{chef.pricePerHour}/Hour
                </p>
              </div>

              {/* Specialties */}
              <div className="pt-2">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Specialties</span>
                <div className="flex flex-wrap justify-center sm:justify-start gap-1.55">
                  {chef.specialties.map((spec, i) => (
                    <span 
                      key={i} 
                      className="bg-slate-50 text-slate-800 border border-slate-200 text-[10px] px-2.5 py-1 rounded-md font-semibold"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* About description */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-850 uppercase tracking-wider">Professional Bio</h2>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold italic">
              "{chef.about}"
            </p>
          </div>

          {/* Reviews List */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xs space-y-6">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Verified Client Reviews ({chef.reviews?.length || 0})
            </h2>
            
            {(!chef.reviews || chef.reviews.length === 0) ? (
              <p className="text-xs text-slate-450 italic">No feedback posts yet. Be the first to book and rate!</p>
            ) : (
              <div className="space-y-5 divide-y divide-emerald-50">
                {chef.reviews.map((rev) => (
                  <div key={rev.id} className="pt-5 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center border border-slate-200">
                          {rev.userName[0]?.toUpperCase() || "S"}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-900">{rev.userName}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">{rev.date}</span>
                        </div>
                      </div>
                      
                      {/* Rating stars */}
                      <div className="flex gap-0.5 text-xs text-amber-600 bg-amber-50 rounded-lg px-2 py-1 font-bold">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-633 italic leading-relaxed font-semibold">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Simple Action Booking Form) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="text-center pb-4 border-b border-slate-100">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Reserve Partner Session</h2>
              <p className="text-[10px] font-bold text-emerald-705 uppercase mt-1">instant reservation dispatch</p>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {/* Cooking Select Options */}
              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
                  Private Session Style
                </label>
                <select
                  value={cookingType}
                  onChange={(e) => setCookingType(e.target.value)}
                  className="w-full border-2 border-emerald-50 hover:border-emerald-100 focus:border-emerald-600 px-3.5 py-3 rounded-xl text-xs bg-white text-emerald-800 font-bold cursor-pointer"
                >
                  <option value="Premium Multi-course Family Feast">Premium Multi-course Family Feast</option>
                  <option value="Executive Fine Dining & Dessert Cursive">Executive Fine Dining & Dessert Cursive</option>
                  <option value="Contemporary Continental Culinary Showcase">Contemporary Continental Culinary Showcase</option>
                  <option value="Traditional Indian & Mughlai Curated Buffet">Traditional Indian & Mughlai Curated Buffet</option>
                  <option value="Specialized KETO / Vegan Organic Diet Plan">Specialized KETO / Vegan Organic Diet Plan</option>
                  <option value="Pan-Asian Elite Chef Table Service">Pan-Asian Elite Chef Table Service</option>
                </select>
              </div>

              {/* Date Input */}
              <div>
                <label htmlFor="booking-date" className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
                  Choose a Date
                </label>
                <input
                  type="date"
                  id="booking-date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-slate-200 focus:border-emerald-600 px-3.5 py-3 rounded-xl text-xs bg-white font-semibold cursor-text"
                />
              </div>

              {/* Row Grid: Start Time & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="booking-time" className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    id="booking-time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full border border-slate-200 focus:border-emerald-605 px-3.5 py-3 rounded-xl text-xs bg-white font-semibold cursor-text"
                  />
                </div>

                <div>
                  <label htmlFor="booking-duration" className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
                    Hours Needed
                  </label>
                  <select
                    id="booking-duration"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full border border-slate-200 focus:border-emerald-605 px-3.5 py-3 rounded-xl text-xs bg-white font-semibold cursor-pointer"
                  >
                    <option value="1">1 Hour</option>
                    <option value="2">2 Hours</option>
                    <option value="3">3 Hours</option>
                    <option value="4">4 Hours</option>
                    <option value="5">5 Hours</option>
                  </select>
                </div>
              </div>

              {/* Home Delivery Address */}
              <div>
                <label htmlFor="booking-address" className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
                  Physical Dispatch Address
                </label>
                <input
                  type="text"
                  id="booking-address"
                  required
                  placeholder="Street and City Area"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-slate-200 focus:border-emerald-605 px-3.5 py-3 rounded-xl text-xs bg-white font-semibold cursor-text"
                />
              </div>

              {/* Special Instructions */}
              <div>
                <label htmlFor="special-instructions" className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Dietary / Preparation Directives
                </label>
                <textarea
                  id="special-instructions"
                  placeholder="Specify custom allergen boundaries, child limits, dietary spice level requests..."
                  rows={2}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full border border-slate-200 focus:border-emerald-605 px-3.5 py-3 rounded-xl text-xs bg-white font-semibold"
                />
              </div>

              {/* Live Price Calculator Section */}
              <div className="bg-emerald-50 rounded-2xl p-4.5 border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Live Quotation</span>
                  <span className="text-xs text-slate-500 font-semibold">{duration} Hours x ₹{chef.pricePerHour}/hr</span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contract Total</span>
                  <span className="text-xl font-extrabold text-emerald-800">₹{totalPrice}</span>
                </div>
              </div>

              {/* Action Button */}
              {currentUser ? (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  id="booking-submit-btn"
                >
                  <span>{loading ? "Completing Dispatch..." : "Confirm Secure Booking"}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    addToast("Please login first to request booking!", "info");
                    setPage("login");
                  }}
                  className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-800 border-2 border-dashed border-slate-200 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Log in to request booking</span>
                </button>
              )}
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
