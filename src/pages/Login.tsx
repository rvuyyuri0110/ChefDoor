import React, { useState } from "react";
import { useApp } from "../context/AppContext";

interface LoginProps {
  onSuccess: () => void;
  onGoToRegister: () => void;
}

export default function Login({ onSuccess, onGoToRegister }: LoginProps) {
  const { login, error, addToast } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      addToast("Please fill in both the email and passcode fields.", "warning");
      return;
    }

    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);

    if (ok) {
      onSuccess();
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white border border-slate-100 rounded-3xl p-8 space-y-6 shadow-xs">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome to ChefDoor</h1>
        <p className="text-xs text-slate-500 mt-1">Sign in to book private chef dispatches directly to your kitchen</p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="login-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            User Email Address
          </label>
          <input
            type="email"
            id="login-email"
            required
            placeholder="student@chefdoor.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-200 focus:border-emerald-600 px-3.5 py-3 rounded-xl text-xs bg-white font-semibold cursor-text"
          />
        </div>

        <div>
          <label htmlFor="login-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Access Passcode
          </label>
          <input
            type="password"
            id="login-password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-slate-200 focus:border-emerald-600 px-3.5 py-3 rounded-xl text-xs bg-white font-semibold cursor-text"
          />
        </div>

        {/* Quick Demo Assist Banner */}
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 text-xs space-y-1.5 text-emerald-800">
          <p className="font-bold">Sandbox Keys:</p>
          <p>• <strong>Individual Customer:</strong> student@chefdoor.com (Passcode: 123)</p>
          <p>• <strong>Culinary Partner:</strong> maya@chefdoor.com (Passcode: 123)</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
          id="login-submit-btn"
        >
          {loading ? "Signing In..." : "Confirm Access"}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500 font-semibold pt-2">
        Don't have an active account?{" "}
        <button
          onClick={onGoToRegister}
          className="text-emerald-700 hover:underline font-bold cursor-pointer"
        >
          Sign up free
        </button>
      </p>
    </div>
  );
}
