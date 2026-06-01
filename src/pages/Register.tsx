import React, { useState } from "react";
import { useApp } from "../context/AppContext";

interface RegisterProps {
  onSuccess: () => void;
  onGoToLogin: () => void;
}

export default function Register({ onSuccess, onGoToLogin }: RegisterProps) {
  const { register, error, addToast } = useApp();
  
  // Fields
  const [role, setRole] = useState<"User" | "Chef">("User");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Chef Specific Fields
  const [pricePerHour, setPricePerHour] = useState("350");
  const [experience, setExperience] = useState("5");
  const [serviceArea, setServiceArea] = useState("Mumbai, MH");
  const [about, setAbout] = useState("");
  const [specialtyInput, setSpecialtyInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      addToast("Please write details into Name, Email, and Passcode fields first!", "warning");
      return;
    }

    setLoading(true);
    const specialties = specialtyInput.split(",").map(s => s.trim()).filter(Boolean);

    const payload = {
      email,
      name,
      password,
      role,
      pricePerHour: role === "Chef" ? Number(pricePerHour) : undefined,
      experience: role === "Chef" ? Number(experience) : undefined,
      serviceArea: role === "Chef" ? serviceArea : undefined,
      about: role === "Chef" ? about : undefined,
      specialties: role === "Chef" && specialties.length > 0 ? specialties : ["Home Cooking Specialist"]
    };

    const ok = await register(payload);
    setLoading(false);

    if (ok) {
      onSuccess();
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white border border-slate-100 rounded-3xl p-8 space-y-6 shadow-xs">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Free Account</h1>
        <p className="text-xs text-slate-500">Register as a customer or an independent culinary partner</p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-250 text-rose-700 text-xs font-semibold rounded-2xl">
          {error}
        </div>
      )}

      {/* Role Toggle Switcher */}
      <div className="bg-slate-50 p-1.5 rounded-2xl grid grid-cols-2 text-center text-xs border border-slate-150">
        <button
          type="button"
          onClick={() => setRole("User")}
          className={`py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
            role === "User" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-700 hover:bg-slate-100"
          }`}
          id="role-user-btn"
        >
          Hire Culinary Staff
        </button>
        <button
          type="button"
          onClick={() => setRole("Chef")}
          className={`py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
            role === "Chef" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-700 hover:bg-slate-100"
          }`}
          id="role-chef-btn"
        >
          Work as Partner Chef
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="reg-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            {role === "Chef" ? "Professional Chef Name" : "Your Name"}
          </label>
          <input
            type="text"
            id="reg-name"
            required
            placeholder={role === "Chef" ? "Chef Sanjeev Kapoor" : "Your Name"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-slate-200 focus:border-emerald-605 px-3.5 py-3 rounded-xl text-xs bg-white font-semibold cursor-text"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="reg-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="reg-email"
            required
            placeholder="student@chefdoor.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-200 focus:border-emerald-605 px-3.5 py-3 rounded-xl text-xs bg-white font-semibold cursor-text"
          />
        </div>

        {/* Passcode */}
        <div>
          <label htmlFor="reg-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Choose Access Passcode
          </label>
          <input
            type="password"
            id="reg-password"
            required
            placeholder="At least 3 characters..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-slate-200 focus:border-emerald-605 px-3.5 py-3 rounded-xl text-xs bg-white font-semibold cursor-text"
          />
        </div>

        {/* CHEF ADDITIONAL FIELDS */}
        {role === "Chef" && (
          <div className="border-t border-slate-100 pt-4 mt-4 space-y-4">
            <h3 className="text-xs font-black text-slate-750 uppercase tracking-wider bg-slate-50 p-2 text-center rounded-lg">Chef Registry Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-750 uppercase tracking-wider mb-1">Hourly rate (₹)</label>
                <input
                  type="number"
                  required
                  min="150"
                  max="1500"
                  value={pricePerHour}
                  onChange={(e) => setPricePerHour(e.target.value)}
                  className="w-full border border-slate-200 focus:border-emerald-600 px-3.5 py-2.5 rounded-xl text-xs bg-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-750 uppercase tracking-wider mb-1">Experience (yrs)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="40"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full border border-slate-200 focus:border-emerald-600 px-3.5 py-2.5 rounded-xl text-xs bg-white font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Service Area / Metropolis</label>
              <input
                type="text"
                required
                placeholder="E.g. South Mumbai, Bangalore North"
                value={serviceArea}
                onChange={(e) => setServiceArea(e.target.value)}
                className="w-full border border-slate-200 focus:border-emerald-600 px-3.5 py-2.5 rounded-xl text-xs bg-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Specialties (comma separated)</label>
              <input
                type="text"
                placeholder="E.g. Mughlai buffet, Tandoor, South Indian fine cuisine"
                value={specialtyInput}
                onChange={(e) => setSpecialtyInput(e.target.value)}
                className="w-full border border-slate-200 focus:border-emerald-600 px-3.5 py-2.5 rounded-xl text-xs bg-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Professional culinary biography</label>
              <textarea
                required
                placeholder="Provide details about your industrial culinary credentials, food certifications, and signature styles..."
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full border border-slate-200 focus:border-emerald-600 px-3.5 py-2.5 rounded-xl text-xs bg-white font-medium"
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
          id="register-submit-btn"
        >
          {loading ? "Registering account..." : "Register"}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500 font-semibold pt-2">
        Already have an active account?{" "}
        <button
          onClick={onGoToLogin}
          className="text-emerald-700 hover:underline font-bold cursor-pointer"
        >
          Login here
        </button>
      </p>
    </div>
  );
}
