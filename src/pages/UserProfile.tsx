import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";

export default function UserProfile() {
  const { currentUser, addToast } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast("⚠️ Please enter a valid name first!", "warning");
      return;
    }

    if (currentUser) {
      currentUser.name = name;
      localStorage.setItem("chefdoor_user", JSON.stringify(currentUser));
      addToast("Your account profile changes were saved successfully!", "success");
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center bg-white border border-slate-100 rounded-3xl space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Please login to view profile</h3>
        <p className="text-xs text-slate-500">Sign in with an active partner key or client account.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-12 bg-white border border-slate-100 rounded-3xl p-8 space-y-8 shadow-xs">
      <div className="text-center space-y-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Your Account Credentials</h1>
          <p className="text-xs text-slate-500 mt-1">Hello {currentUser.name}, edit your display credentials here</p>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-5">
        
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Your Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-slate-200 focus:border-emerald-600 px-4 py-3 rounded-xl text-xs bg-white font-semibold cursor-text"
          />
        </div>

        {/* Email - Disabled */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address (Not Editable)</label>
          <input
            type="email"
            disabled
            value={email}
            className="w-full border border-slate-100 px-4 py-3 rounded-xl text-xs bg-slate-50 text-slate-450 font-semibold cursor-not-allowed"
          />
        </div>

        {/* Registered Role */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Role Type (Not Editable)</label>
          <input
            type="text"
            disabled
            value={currentUser.role === "Chef" ? "Registered Private Culinary Partner" : "Individual Customer"}
            className="w-full border border-slate-100 px-4 py-3 rounded-xl text-xs bg-slate-50 text-slate-450 font-semibold cursor-not-allowed"
          />
        </div>

        {/* Demo instructions */}
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 text-xs space-y-1.5 text-emerald-800">
          <p className="font-bold">Need to test Partner/Chef functions?</p>
          <p className="leading-relaxed">
            You are currently signed in as a <strong className="text-emerald-950 font-extrabold">{currentUser.role === "Chef" ? "Registered Private Culinary Partner" : "Individual Customer"}</strong>. You can sign out and register a new Chef profile to manage client sessions and view active incoming dispatches.
          </p>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
          id="update-profile-submit-btn"
        >
          Save Profile Changes
        </button>
      </form>
    </div>
  );
}
