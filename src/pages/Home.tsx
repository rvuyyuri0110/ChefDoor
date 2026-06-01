import React from "react";
import { Chef } from "../types";
import ChefCard from "../components/ChefCard";

interface HomeProps {
  chefs: Chef[];
  onSelectChef: (chefId: string) => void;
  setPage: (page: string) => void;
}

export default function Home({ chefs, onSelectChef, setPage }: HomeProps) {
  // Sort by rating to show popular chefs
  const popularChefs = [...chefs]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen px-4 md:px-8 py-6 space-y-12">
      {/* Hero Section - Apple Aesthetics with Floating Accents & 40px rounded corners */}
      <section className="relative bg-emerald-50 rounded-4xl p-8 md:p-16 overflow-hidden flex flex-col justify-center min-h-[360px] max-w-7xl mx-auto w-full border border-emerald-100/50 shadow-xs">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white text-emerald-800 text-[10px] font-bold px-3 py-1.5 rounded-full border border-emerald-200/40 mb-6 uppercase tracking-wider shadow-2xs">
            <span>Professional In-Home Cooking & Meals</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-5 font-display">
            Book Verified <span className="text-emerald-600">Private Chefs</span> <br/>
            for Your Home Kitchen
          </h1>
          
          <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-lg mb-8 font-medium">
            Find handpicked professional home chefs to prepare fresh, delicious meals in your kitchen. Perfect for family dinners, weekly meal prep, or cozy celebrations.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => setPage("browse")}
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/15 hover:shadow-xl transition-all active:scale-95 text-xs uppercase tracking-wider cursor-pointer"
              id="hero-browse"
            >
              Choose Verified Chefs
            </button>
            <button
              onClick={() => setPage("about")}
              className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-emerald-50 text-emerald-800 border-2 border-slate-100 font-bold rounded-2xl transition-all active:scale-95 text-xs uppercase tracking-wider cursor-pointer"
              id="hero-how-it-works"
            >
              Our Standards
            </button>
          </div>
        </div>

        {/* Beautiful Elegant Floating Illustration Mockup Shapes from Design HTML */}
        <div className="absolute right-12 md:right-24 top-1/2 -translate-y-1/2 w-52 h-52 bg-emerald-200/40 rounded-full opacity-60 hidden md:block"></div>
        <div className="absolute right-28 md:right-36 top-12 w-20 h-20 bg-emerald-300/30 rounded-3xl rotate-12 hidden md:block border-2 border-emerald-100/20"></div>
        <div className="absolute right-2 top-1/3 w-8 h-8 bg-emerald-400/20 rounded-full hidden md:block"></div>
      </section>

      {/* Onboarding / Simple Rules Section */}
      <section className="py-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            Hassle-Free Placement Process
          </h2>
          <p className="text-xs font-bold text-emerald-705 uppercase tracking-wider mt-2">seamless culinary integration in 3 steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 flex flex-col items-center text-center shadow-2xs hover:border-emerald-205 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-700 text-sm font-bold border border-slate-100 mb-6">
              Step 1
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-3">Filter Private Profiles</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Scan qualified partner chefs with vetted luxury references, location specialties, and experience ratings.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 flex flex-col items-center text-center shadow-2xs hover:border-emerald-205 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-700 text-sm font-bold border border-slate-100 mb-6">
              Step 2
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-3">Book Your Menu Slot</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Select key cuisines, duration, date, and input direct requests to securely schedule the culinary deployment.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 flex flex-col items-center text-center shadow-2xs hover:border-emerald-205 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-700 text-sm font-bold border border-slate-100 mb-6">
              Step 3
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-3">Premium Hygiene & Rate</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Confirm convenient UPI billing after preparation, experience culinary delight, and share constructive executive ratings.
            </p>
          </div>
        </div>
      </section>

      {/* Popular/Top Chefs - High spacing and professional rounded forms */}
      <section className="bg-emerald-50/20 border border-slate-100 rounded-4xl py-12 md:py-16 px-6 max-w-7xl mx-auto w-full">
        <div className="w-full">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10">
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
                Featured Executive Chefs
              </h2>
              <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider mt-1">
                Highest rated culinary artisans booked this month
              </p>
            </div>
            <button
              onClick={() => setPage("browse")}
              className="mt-4 md:mt-0 text-xs font-bold text-emerald-750 hover:text-emerald-800 underline underline-offset-4 decoration-2"
            >
              See all active partners →
            </button>
          </div>

          {popularChefs.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400 font-medium">
              No professional partners listed currently.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularChefs.map((chef) => (
                <ChefCard 
                  key={chef.id} 
                  chef={chef} 
                  onSelect={onSelectChef} 
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Safety & Reviews Section */}
      <section className="py-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-4 font-display">
              Strict Food Safety & Compliance Guidelines
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed mb-6 font-semibold">
              Our registered chefs adhere strictly to premium safety and quality parameters, including hand sanitize regimens, organic vegetable wash, and thorough post-run workspace sanitization protocols.
            </p>
            <div className="space-y-3.5 text-xs text-emerald-805 font-bold">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xs">A</span>
                <span>Fresh vegetable cleaning wash and organic standards</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xs">B</span>
                <span>Complete workspace sterilization both before and after</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xs">C</span>
                <span>Strict ingredient compliance and zero synthetic colours</span>
              </div>
            </div>
          </div>

          {/* Testimonial card */}
          <div className="bg-emerald-50 rounded-4xl border border-emerald-100 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 font-serif text-[120px] text-emerald-305/10 leading-none select-none">
              “
            </div>
            <div className="flex gap-1 mb-4 text-emerald-600 font-bold text-xs uppercase tracking-wider">
              <span>Verified Customer Review</span>
            </div>
            <p className="text-emerald-950 font-medium text-sm leading-relaxed mb-6 relative z-10 italic">
              "We booked Chef Priya for a weekend family gathering. The Malabar specialties were incredibly authentic, and she left our kitchen perfectly clean. It was a wonderful dining experience at home!"
            </p>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-800 font-extrabold text-xs shadow-sm border border-emerald-100">
                MI
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Mahesh Iyer</h4>
                <p className="text-[10px] text-emerald-705 font-medium uppercase tracking-wider font-sans">Indiranagar, Bengaluru</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
