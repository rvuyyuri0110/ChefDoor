import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Booking } from "../types";

export default function ChefDashboard() {
  const { 
    currentUser, 
    currentChefProfile, 
    bookings, 
    updateBookingStatus, 
    updateChefProfile, 
    addToast 
  } = useApp();

  const [hasFallbackFailed, setHasFallbackFailed] = useState(false);

  const isFemale = currentChefProfile?.name?.toLowerCase().includes("priya") || 
                   currentChefProfile?.name?.toLowerCase().includes("kavitha") || 
                   currentChefProfile?.name?.toLowerCase().includes("maya") || 
                   currentChefProfile?.name?.toLowerCase().includes("nair") ||
                   currentChefProfile?.name?.toLowerCase().includes("reddy") ||
                   false;

  const getFallbackImgUrl = () => {
    return isFemale
      ? "https://images.unsplash.com/photo-1574085733277-851d9d856a3a?w=400&auto=format&fit=crop&q=80"
      : "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80";
  };

  const chefBookings = bookings.filter(b => b.chefId === currentUser?.chefProfileId);

  // Group bookings
  const pendingRequests = chefBookings.filter(b => b.status === "Pending");
  const acceptedOrders = chefBookings.filter(b => b.status === "Accepted");
  const pastOrders = chefBookings.filter(b => b.status === "Completed" || b.status === "Rejected");

  // Profile Edit fields inside Chef Center
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [pricePerHour, setPricePerHour] = useState(25);
  const [experience, setExperience] = useState(5);
  const [serviceArea, setServiceArea] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [newSpecialty, setNewSpecialty] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);

  // Track profile initialization
  useEffect(() => {
    if (currentChefProfile) {
      setProfileName(currentChefProfile.name || "");
      setPricePerHour(currentChefProfile.pricePerHour || 250);
      setExperience(currentChefProfile.experience || 3);
      setServiceArea(currentChefProfile.serviceArea || "");
      setAboutText(currentChefProfile.about || "");
      setSpecialties(currentChefProfile.specialties || []);
    }
  }, [currentChefProfile, isEditingProfile]);

  const handleSaveProfile = async () => {
    if (!currentChefProfile) return;
    if (!profileName.trim() || !serviceArea.trim() || !aboutText.trim()) {
      addToast("⚠️ Please fill out all profile edits cleanly!", "warning");
      return;
    }

    const success = await updateChefProfile(currentChefProfile.id, {
      name: profileName,
      pricePerHour,
      experience,
      serviceArea,
      about: aboutText,
      specialties
    });

    if (success) {
      setIsEditingProfile(false);
    }
  };

  const addSpecialtyTag = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setSpecialties(prev => [...prev, newSpecialty.trim()]);
      setNewSpecialty("");
    }
  };

  const removeSpecialtyTag = (tag: string) => {
    setSpecialties(prev => prev.filter(t => t !== tag));
  };

  const renderBookingRow = (b: Booking, showActions: boolean) => {
    return (
      <div 
        key={b.id} 
        className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:border-slate-200"
        id={`chef-dashboard-booking-${b.id}`}
      >
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-700 bg-slate-50 border border-slate-150 rounded-md px-2 py-0.5 uppercase tracking-wider">
              Contract Event: #{b.id.substring(8) || b.id}
            </span>
            <span className="text-xs text-slate-400 font-semibold">{b.date} at {b.startTime} ({b.duration} hours)</span>
          </div>

          <h3 className="text-sm font-extrabold text-slate-800">
            Client: {b.userName}
          </h3>

          <p className="text-xs text-slate-500 font-medium">
            <strong>Assigned Style:</strong> {b.cookingType}
          </p>

          <p className="text-[11px] text-slate-550 font-medium">
            <strong>Dispatch Location:</strong> <span className="underline underline-offset-2">{b.address}</span>
          </p>

          {b.specialInstructions && (
            <p className="text-xs text-slate-500 italic p-2 bg-slate-50 border border-gray-100/50 rounded-xl max-w-lg">
              "{b.specialInstructions}"
            </p>
          )}
        </div>

        {/* Price & status */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 gap-3.5">
          <div className="text-left md:text-right">
            <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total earnings</span>
            <span className="text-base font-extrabold text-emerald-700">₹{b.totalPrice}</span>
          </div>

          {/* Quick status displays */}
          <div className="flex items-center gap-1.5">
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
              b.paymentStatus === "Paid" ? "bg-emerald-50 text-emerald-800 border-emerald-250" : "bg-rose-50 text-rose-700 border-rose-150"
            }`}>
              {b.paymentStatus === "Paid" ? "Paid" : "Unpaid"}
            </span>
            
            <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${
              b.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200" :
              b.status === "Accepted" ? "bg-emerald-50 text-emerald-700 border-emerald-150" :
              b.status === "Completed" ? "bg-emerald-600 text-white border-emerald-600" :
              "bg-rose-50 border-rose-200 text-rose-700"
            }`}>
              {b.status}
            </span>
          </div>

          {/* Accept / Reject actions */}
          {showActions && b.status === "Pending" && (
            <div className="flex items-center gap-2 mt-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => updateBookingStatus(b.id, "Rejected")}
                className="px-4 py-2 bg-white border border-slate-200 text-rose-600 rounded-xl text-xs font-bold hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
                id={`reject-btn-${b.id}`}
              >
                Decline Request
              </button>
              <button
                onClick={() => updateBookingStatus(b.id, "Accepted")}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                id={`accept-btn-${b.id}`}
              >
                Confirm Dispatch
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen grid grid-cols-1 lg:grid-cols-12 gap-10">
      
      {/* Left Column - Cooking Quests / Booking requests */}
      <div className="lg:col-span-8 space-y-10">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Culinary Partner Workdesk</h1>
          <p className="text-xs font-semibold text-slate-500 uppercase mt-1">Review active client dispatches, coordinate live sessions, and manage your public marketplace profile</p>
        </div>

        {/* 1. New Booking Requests */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            ⏳ New Client Bookings ({pendingRequests.length})
          </h2>
          {pendingRequests.length === 0 ? (
            <div className="p-8 text-center bg-white border border-slate-100 rounded-3xl">
              <p className="text-xs text-slate-400 italic">No incoming reservation drafts at this hour.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map(b => renderBookingRow(b, true))}
            </div>
          )}
        </div>

        {/* 2. Accepted Orders */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            🍳 Scheduled Chef Engagements ({acceptedOrders.length})
          </h2>
          {acceptedOrders.length === 0 ? (
            <div className="p-8 text-center bg-white border border-slate-100 rounded-3xl">
              <p className="text-xs text-slate-400 italic">No active upcoming sessions on record.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {acceptedOrders.map(b => renderBookingRow(b, false))}
            </div>
          )}
        </div>

        {/* 3. Past Orders */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            🍽️ Completed Sessions History ({pastOrders.length})
          </h2>
          {pastOrders.length === 0 ? (
            <div className="p-8 text-center bg-white border border-slate-100 rounded-3xl">
              <p className="text-xs text-slate-400 italic">No history found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pastOrders.map(b => renderBookingRow(b, false))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column - Chef Profile Customizer Widget */}
      <div className="lg:col-span-4">
        {currentChefProfile && (
          <div className="sticky top-24 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Partner Profile Showcase</h3>
                <p className="text-[10px] text-slate-405 font-bold uppercase tracking-wider">Public Marketplace Display</p>
              </div>
              
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all cursor-pointer font-bold"
                id="edit-profile-toggle"
              >
                {isEditingProfile ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {isEditingProfile ? (
              // EDIT MODE
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Chef Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full border border-slate-250 focus:border-emerald-600 px-3 py-2.5 rounded-xl text-xs bg-white font-medium cursor-text"
                  />
                </div>

                {/* Price Per Hr */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 uppercase mb-1">
                    <span>Hourly rate</span>
                    <span className="text-emerald-700">₹{pricePerHour}/hr</span>
                  </div>
                  <input
                    type="range"
                    min="150"
                    max="1500"
                    step="50"
                    value={pricePerHour}
                    onChange={(e) => setPricePerHour(Number(e.target.value))}
                    className="w-full h-1 bg-slate-100 accent-emerald-600 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Years Experience */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Years experience</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={experience}
                    onChange={(e) => setExperience(Number(e.target.value))}
                    className="w-full border border-slate-250 focus:border-emerald-600 px-3 py-2.5 rounded-xl text-xs bg-white font-medium cursor-text"
                  />
                </div>

                {/* Location area */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Service Area Location</label>
                  <input
                    type="text"
                    value={serviceArea}
                    onChange={(e) => setServiceArea(e.target.value)}
                    className="w-full border border-slate-250 focus:border-emerald-600 px-3 py-2.5 rounded-xl text-xs bg-white font-medium cursor-text"
                  />
                </div>

                {/* Specialties Tags Creator */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Edit Specialties</label>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {specialties.map(spec => (
                      <span 
                        key={spec} 
                        className="bg-slate-50 text-slate-805 text-[10px] px-2 py-1 rounded-md border border-slate-200 font-semibold flex items-center gap-1"
                      >
                        {spec}
                        <button 
                          type="button" 
                          onClick={() => removeSpecialtyTag(spec)} 
                          className="text-rose-600 font-bold pl-1 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add e.g. Pasta, Mughlai, South Indian"
                      value={newSpecialty}
                      onChange={(e) => setNewSpecialty(e.target.value)}
                      className="flex-1 border border-slate-200 focus:border-emerald-600 px-3 py-2 rounded-xl text-xs bg-white font-medium"
                    />
                    <button
                      type="button"
                      onClick={addSpecialtyTag}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Self Introduction bio */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Biography / About You</label>
                  <textarea
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    className="w-full border border-slate-250 focus:border-emerald-600 px-3 py-2.5 rounded-xl text-xs bg-white font-medium"
                    rows={4}
                  />
                </div>

                {/* Save button */}
                <button
                  onClick={handleSaveProfile}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase transition-all shadow-md active:scale-95 cursor-pointer"
                  id="chef-save-profile-btn"
                >
                  Confirm Profile Updates
                </button>
              </div>
            ) : (
              // READ MODE
              <div className="text-center space-y-5">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-2 border-slate-100 bg-emerald-50 shadow-xs flex items-center justify-center">
                  {hasFallbackFailed ? (
                    <div className={`w-full h-full bg-gradient-to-br ${
                      isFemale 
                        ? "from-rose-100/50 to-orange-50/80" 
                        : "from-emerald-150/50 to-teal-50"
                    } flex flex-col items-center justify-center text-center select-none`}>
                      <span className="text-lg font-black text-emerald-800">
                        {currentChefProfile.name.split(" ").filter(n => n.toLowerCase() !== "chef").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  ) : (
                    <img 
                      src={currentChefProfile.photoUrl} 
                      alt={currentChefProfile.name}
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

                <div>
                  <h4 className="text-lg font-extrabold text-slate-900 tracking-tight">{currentChefProfile.name}</h4>
                  <div className="flex justify-center items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 max-w-[124px] mx-auto text-xs font-bold text-emerald-800 mt-1">
                    <span>★ {currentChefProfile.rating.toFixed(1)} Stars</span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-2 text-left bg-slate-50/50 p-4 border border-slate-100 rounded-2xl font-semibold">
                  <p>💸 <strong>Hourly rate:</strong> ₹{currentChefProfile.pricePerHour}/Hour</p>
                  <p>🎓 <strong>Experience:</strong> {currentChefProfile.experience} Years Active Industry Experience</p>
                  <p>📍 <strong>Metropolis Region:</strong> {currentChefProfile.serviceArea}</p>
                </div>

                <div className="text-left">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">My Specialties</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentChefProfile.specialties.map(spec => (
                      <span 
                        key={spec} 
                        className="bg-slate-50 text-slate-800 text-[11px] font-semibold border border-slate-200 px-2.5 py-1 rounded-md"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-600 italic leading-relaxed text-left border-t border-slate-100 pt-4 font-normal">
                  "{currentChefProfile.about}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
