import React from "react";
import { Chef } from "../types";

interface ChefCardProps {
  key?: any;
  chef: Chef;
  onSelect: (chefId: string) => void;
}

export default function ChefCard({ chef, onSelect }: ChefCardProps) {
  const [hasFallbackFailed, setHasFallbackFailed] = React.useState(false);

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

  return (
    <div 
      className="bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-300 transition-all duration-300 flex flex-col group h-full shadow-2xs"
      id={`chef-card-${chef.id}`}
    >
      {/* Photo header with premium aspect ratio and subtle gradient fallback */}
      <div className="relative aspect-video w-full bg-emerald-50 overflow-hidden">
        {hasFallbackFailed ? (
          <div className={`w-full h-full bg-gradient-to-br ${
            isFemale 
              ? "from-rose-100/50 to-orange-50/80" 
              : "from-emerald-150/50 to-teal-50"
          } flex flex-col items-center justify-center p-4 text-center select-none`}>
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-xs border border-emerald-100 mb-1.5">
              <span className="text-sm font-extrabold text-emerald-800">
                {chef.name.split(" ").filter(n => n.toLowerCase() !== "chef").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-800 leading-tight">{chef.name}</p>
            <p className="text-[9px] font-semibold text-emerald-700 uppercase tracking-widest mt-0.5">
              {isFemale ? "Chef (Female)" : "Chef (Male)"}
            </p>
          </div>
        ) : (
          <img 
            src={chef.photoUrl} 
            alt={chef.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
        
        {/* Experience Tag with text-only style */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg border border-emerald-100 shadow-sm">
          {chef.experience} Years Experience
        </div>

        {/* Price/Hour Tag - Indian Rupees */}
        <div className="absolute bottom-3 right-3 bg-emerald-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-md tracking-wider">
          ₹{chef.pricePerHour} / hour
        </div>
      </div>

      {/* Main card body with large spacing */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header row */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-extrabold text-slate-800 group-hover:text-emerald-700 transition-colors font-display">
              {chef.name}
            </h3>
            {/* Rating Badge */}
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-emerald-100/50">
              <span className="text-emerald-605">★</span>
              <span>{chef.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Location / Service area */}
          <div className="text-[11px] text-slate-500 font-semibold mb-4 tracking-wide">
            Location: {chef.serviceArea}
          </div>

          {/* Specialties items with safe lists */}
          <div className="mb-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Signature Cuisines</p>
            <div className="flex flex-wrap gap-1.5">
              {chef.specialties.map((spec, i) => (
                <span 
                  key={i} 
                  className="bg-slate-50 text-slate-700 border border-slate-100 text-[10px] px-2.5 py-1 rounded-md font-semibold"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Fun friendly descriptive summary */}
          <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed mb-4 italic">
            "{chef.about}"
          </p>
        </div>

        {/* View Profile Action */}
        <button
          onClick={() => onSelect(chef.id)}
          className="w-full mt-2 py-3 bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-200 hover:border-emerald-600 rounded-xl text-xs font-bold transition-all duration-200 active:scale-[0.98] cursor-pointer uppercase tracking-wider"
          id={`view-profile-${chef.id}`}
        >
          View Profile & Book
        </button>
      </div>
    </div>
  );
}
