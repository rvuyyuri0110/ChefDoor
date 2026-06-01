import React, { useState } from "react";
import { Booking } from "../types";
import { useApp } from "../context/AppContext";

interface PaymentPageProps {
  booking: Booking;
  onBack: () => void;
  onSuccess: () => void;
}

export default function PaymentPage({ booking, onBack, onSuccess }: PaymentPageProps) {
  const { submitPayment, addToast } = useApp();
  const [selectedMethod, setSelectedMethod] = useState<"UPI" | "Cash">("UPI");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const ok = await submitPayment(booking.id, selectedMethod);
    setLoading(false);

    if (ok) {
      setIsSuccess(true);
    } else {
      addToast("Payment failed! Please verify internet status.", "warning");
    }
  };

  if (isSuccess) {
    return (
      <div 
        className="max-w-md mx-auto my-20 bg-white border border-slate-100 rounded-3xl p-8 text-center space-y-6 shadow-xs"
        id="payment-success-screen"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-200">
          <span className="text-xl font-bold">✓</span>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Payment Successful</h2>
          <p className="text-xs text-slate-500 font-medium">Your private request session with <strong className="text-emerald-850">{booking.chefName}</strong> has been secured.</p>
        </div>

        {/* Happy summary card */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left text-xs space-y-2 text-slate-700 font-semibold">
          <p>💸 <strong>Amount Settled:</strong> ₹{booking.totalPrice}</p>
          <p>🍳 <strong>Assigned Style:</strong> {booking.cookingType}</p>
          <p>📍 <strong>Dispatch Destination:</strong> {booking.address}</p>
          <p>💳 <strong>Settlement Method:</strong> {selectedMethod === "UPI" ? "Universal UPI Gateway" : "In-Person Cash Settlement"}</p>
        </div>

        <button
          onClick={onSuccess}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
          id="success-continue-btn"
        >
          View Active Bookings
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-12 bg-white border border-slate-100 rounded-3xl p-8 space-y-8 shadow-xs">
      {/* Back to bookings button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-emerald-705 hover:text-emerald-800 transition-colors uppercase tracking-wider cursor-pointer"
        id="payment-back-btn"
      >
        <span>← Back To Bookings</span>
      </button>

      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight text-center">Payment Checkout</h1>
        <p className="text-xs text-slate-500 mt-1">Select UPI or Cash method to finalize your booking</p>
      </div>

      {/* Booking Invoice description */}
      <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-105 space-y-3.5">
        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">Order Bill Summary</span>
        <div className="flex justify-between items-center text-xs font-medium">
          <span className="text-slate-505">Partner:</span>
          <strong className="text-slate-900 font-bold">{booking.chefName}</strong>
        </div>
        <div className="flex justify-between items-center text-xs font-medium border-b border-slate-100 pb-2">
          <span className="text-slate-505">Duration requested:</span>
          <strong className="text-slate-700 font-bold">{booking.duration} hours</strong>
        </div>
        <div className="flex justify-between items-center text-xs font-extrabold text-slate-900 pt-1">
          <span>Amount due:</span>
          <span className="text-lg text-emerald-700">₹{booking.totalPrice}</span>
        </div>
      </div>

      <form onSubmit={handlePaySubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Choose Payment Method
          </label>
          
          <div className="grid grid-cols-2 gap-4">
            {/* UPI Option */}
            <button
              type="button"
              onClick={() => setSelectedMethod("UPI")}
              className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-1.5 border-2 transition-all cursor-pointer ${
                selectedMethod === "UPI"
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800 font-bold"
                  : "border-slate-105 text-slate-500 hover:border-slate-200"
              }`}
            >
              <span className="text-sm font-black">UPI</span>
              <span className="text-[10px] uppercase font-bold tracking-wider">UPI Digital</span>
            </button>

            {/* Cash Option */}
            <button
              type="button"
              onClick={() => setSelectedMethod("Cash")}
              className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-1.5 border-2 transition-all cursor-pointer ${
                selectedMethod === "Cash"
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800 font-bold"
                  : "border-slate-105 text-slate-500 hover:border-slate-200"
              }`}
            >
              <span className="text-sm font-black">COD</span>
              <span className="text-[10px] uppercase font-bold tracking-wider">Cash At Door</span>
            </button>
          </div>
        </div>

        {/* Secure badge */}
        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-800 font-bold border border-emerald-100 text-[11px] text-center">
          <span>Secure escrow system protects both clients and private chefs.</span>
        </div>

        {/* Checkout Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition-all shadow-md active:scale-95 cursor-pointer"
          id="confirm-pay-btn"
        >
          {loading ? "Approving payment..." : `PAY NOW (₹${booking.totalPrice})`}
        </button>
      </form>
    </div>
  );
}
