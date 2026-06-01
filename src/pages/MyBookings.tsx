import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Booking } from "../types";

interface MyBookingsProps {
  onGoToPayment: (booking: Booking) => void;
}

export default function MyBookings({ onGoToPayment }: MyBookingsProps) {
  const { bookings, updateBookingStatus, submitChefRating, addToast } = useApp();

  // Dialog State for Rating
  const [activeRatingBookingId, setActiveRatingBookingId] = useState<string | null>(null);
  const [starsSelected, setStarsSelected] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Group bookings as per PDF
  const pendingBookings = bookings.filter(b => b.status === "Pending");
  const upcomingBookings = bookings.filter(b => b.status === "Accepted");
  const completedBookings = bookings.filter(b => b.status === "Completed" || b.status === "Rejected");

  const handleOpenRatingDialog = (bookingId: string) => {
    setActiveRatingBookingId(bookingId);
    setStarsSelected(5);
    setFeedbackText("");
  };

  const handleCloseRatingDialog = () => {
    setActiveRatingBookingId(null);
  };

  const handleReviewFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRatingBookingId) return;

    if (!feedbackText.trim()) {
      addToast("⚠️ Please write a small sentence for your review!", "warning");
      return;
    }

    setSubmittingReview(true);
    const ok = await submitChefRating(activeRatingBookingId, starsSelected, feedbackText);
    setSubmittingReview(false);

    if (ok) {
      handleCloseRatingDialog();
    }
  };

  const renderBookingCard = (b: Booking, type: "pending" | "upcoming" | "completed") => {
    return (
      <div 
        key={b.id}
        className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-all space-y-4"
        id={`user-booking-card-${b.id}`}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
          <div>
            <span className="inline-block text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-50 text-slate-705 border border-slate-150 mb-2">
              Contract ID: #{b.id.substring(8) || b.id}
            </span>
            <h3 className="text-base font-bold text-gray-900">Partner: {b.chefName}</h3>
            <p className="text-xs text-slate-500 font-medium">{b.cookingType}</p>
          </div>
          
          <div className="text-right">
            <span className="block text-sm font-black text-emerald-800">₹{b.totalPrice}</span>
            <span className="text-[10px] text-slate-400 font-medium">{b.duration} hours service</span>
          </div>
        </div>

        {/* Core parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-xs font-semibold text-slate-700">
          <p>
            <strong>Scheduled:</strong> {b.date} at {b.startTime}
          </p>
          <p>
            <strong className="truncate">Location:</strong> {b.address}
          </p>
          {b.specialInstructions && (
            <p className="col-span-1 sm:col-span-2 text-slate-500 italic mt-1 font-sans">
              "Note: {b.specialInstructions}"
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
          {/* Status badge */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-600">Status:</span>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
              b.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200" :
              b.status === "Accepted" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
              b.status === "Completed" ? "bg-emerald-600 text-white border-emerald-600" :
              "bg-rose-50 text-rose-700 border-rose-200"
            }`}>
              {b.status === "Pending" ? "Pending Review" :
               b.status === "Accepted" ? "Chef Coming!" :
               b.status === "Completed" ? "Order Complete" :
               "Rejected"}
            </span>

            {/* Payment badge */}
            {b.status !== "Rejected" && (
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide border ${
                b.paymentStatus === "Paid" ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
              }`}>
                {b.paymentStatus === "Paid" ? "Paid" : "Unpaid"}
              </span>
            )}
          </div>

          {/* Direct actionable buttons based on user lifecycle */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {type === "upcoming" && b.paymentStatus === "Unpaid" && (
              <button 
                onClick={() => onGoToPayment(b)}
                className="w-full sm:w-auto px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
                id={`pay-btn-${b.id}`}
              >
                Set up Instant UPI / Cash Payment
              </button>
            )}

            {type === "upcoming" && b.paymentStatus === "Paid" && (
              <button 
                onClick={async () => {
                  if (confirm("Are you sure this service is complete and we can unlock payment for the chef?")) {
                    await updateBookingStatus(b.id, "Completed");
                  }
                }}
                className="w-full sm:w-auto px-4.5 py-2.5 bg-emerald-50 hover:bg-emerald-150 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                id={`complete-btn-${b.id}`}
              >
                Mark Preparation Completed & Release Escrow
              </button>
            )}

            {type === "completed" && b.status === "Completed" && (
              b.ratingGiven ? (
                <div className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-150 flex items-center gap-1">
                  <span>Rated {b.ratingGiven} Stars!</span>
                </div>
              ) : (
                <button
                  onClick={() => handleOpenRatingDialog(b.id)}
                  className="w-full sm:w-auto px-4.5 py-2.5 bg-white hover:bg-emerald-50 text-emerald-850 font-bold border border-emerald-200 rounded-xl text-xs hover:border-emerald-300 active:scale-95 transition-all cursor-pointer"
                  id={`rate-btn-${b.id}`}
                >
                  Rate Partner
                </button>
              )
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 min-h-screen space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Culinary Contracts</h1>
        <p className="text-xs font-semibold text-emerald-700 uppercase mt-1">Track the active status and dispatch logs of your private kitchen bookings</p>
      </div>

      {/* 1. Pending Bookings */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Pending Confirmations ({pendingBookings.length})
        </h2>
        {pendingBookings.length === 0 ? (
          <p className="text-xs text-slate-400 italic bg-white border border-slate-100 p-6 rounded-2xl">No pending culinary requests found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {pendingBookings.map(b => renderBookingCard(b, "pending"))}
          </div>
        )}
      </div>

      {/* 2. Upcoming / Accepted Bookings */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Scheduled Dinings ({upcomingBookings.length})
        </h2>
        {upcomingBookings.length === 0 ? (
          <p className="text-xs text-slate-405 italic bg-white border border-slate-100 p-6 rounded-2xl">No upcoming confirmed chef dispatches registered.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {upcomingBookings.map(b => renderBookingCard(b, "upcoming"))}
          </div>
        )}
      </div>

      {/* 3. Completed / Past Bookings */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Completed Historic Assignments ({completedBookings.length})
        </h2>
        {completedBookings.length === 0 ? (
          <p className="text-xs text-slate-405 italic bg-white border border-slate-100 p-6 rounded-2xl">No past culinary logs available.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {completedBookings.map(b => renderBookingCard(b, "completed"))}
          </div>
        )}
      </div>

      {/* Star feedback Modal */}
      {activeRatingBookingId && (
        <div id="rating-modal" className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 border border-slate-150 shadow-xl space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-extrabold text-slate-900 mt-4">Rate Your Chef's Cooking</h3>
              <p className="text-xs text-slate-500 mt-1">Please score the workspace hygiene and taste accuracy</p>
            </div>

            <form onSubmit={handleReviewFormSubmit} className="space-y-5">
              {/* Star selector */}
              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setStarsSelected(star)}
                    className="p-1 active:scale-95 transition-transform"
                  >
                    <span className={`text-3xl cursor-pointer ${
                      star <= starsSelected ? "text-amber-500" : "text-slate-200"
                    }`}>
                      ★
                    </span>
                  </button>
                ))}
              </div>

              {/* Feedback Comment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Write a review message to the partner</label>
                <textarea
                  required
                  placeholder="Highly professional, excellent preparation standards, cleaned up station thoroughly..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full border border-slate-200 focus:border-emerald-600 px-3.5 py-3 rounded-xl text-xs bg-white font-medium"
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseRatingDialog}
                  className="py-3 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-750 rounded-xl text-xs font-bold uppercase transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl text-xs font-bold uppercase transition-all"
                >
                  {submittingReview ? "Posting..." : "Confirm Rating"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
