import React, { useState, useMemo } from "react";
import { Chef } from "../types";
import ChefCard from "../components/ChefCard";

interface BrowseChefsProps {
  chefs: Chef[];
  onSelectChef: (chefId: string) => void;
}

export default function BrowseChefs({ chefs, onSelectChef }: BrowseChefsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [selectedArea, setSelectedArea] = useState("All");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState("rating-desc");

  // Dynamically extract unique specialties & service areas from our active chefs database
  const allSpecialties = useMemo(() => {
    const list = new Set<string>();
    chefs.forEach(c => {
      c.specialties.forEach(spec => list.add(spec));
    });
    return ["All", ...Array.from(list)];
  }, [chefs]);

  const allAreas = useMemo(() => {
    const list = new Set<string>();
    chefs.forEach(c => list.add(c.serviceArea));
    return ["All", ...Array.from(list)];
  }, [chefs]);

  // Handle live filtering and sorting
  const filteredChefs = useMemo(() => {
    let result = [...chefs];

    // Search query matches names or specialties or service area
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        c => 
          c.name.toLowerCase().includes(q) ||
          c.about.toLowerCase().includes(q) ||
          c.serviceArea.toLowerCase().includes(q) ||
          c.specialties.some(spec => spec.toLowerCase().includes(q))
      );
    }

    // Filter by Specialty
    if (selectedSpecialty !== "All") {
      result = result.filter(c => c.specialties.includes(selectedSpecialty));
    }

    // Filter by Service Area
    if (selectedArea !== "All") {
      result = result.filter(c => c.serviceArea === selectedArea);
    }

    // Filter by Max Price
    result = result.filter(c => c.pricePerHour <= maxPrice);

    // Sort Dropdown implementation
    if (sortBy === "rating-desc") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "price-asc") {
      result.sort((a, b) => a.pricePerHour - b.pricePerHour);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.pricePerHour - a.pricePerHour);
    } else if (sortBy === "experience-desc") {
      result.sort((a, b) => b.experience - a.experience);
    }

    return result;
  }, [chefs, searchQuery, selectedSpecialty, selectedArea, maxPrice, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
      
      {/* Search Header Banner */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">Contract Premium Private Chefs</h1>
        <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mt-1.5">Background-verified culinary partners on demand</p>
      </div>

      {/* Main Search Bar Inputs */}
      <div className="relative max-w-2xl mx-auto mb-10">
        <input
          type="text"
          placeholder="Search by chef name, specialty cuisine, or city area (e.g., Bandra)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full px-5 py-3.5 border border-slate-200 hover:border-emerald-300 focus:border-emerald-600 bg-white rounded-2xl text-xs placeholder-slate-400 shadow-2xs transition-all font-semibold"
          id="chef-search-input"
        />
      </div>

      {/* Grid of filters and sorting */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters Widget on Left */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 self-start space-y-6 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Filter Options
            </h3>
            <button 
              onClick={() => {
                setSelectedSpecialty("All");
                setSelectedArea("All");
                setMaxPrice(1000);
                setSearchQuery("");
                setSortBy("rating-desc");
              }}
              className="text-[10px] font-bold text-emerald-750 hover:text-emerald-800 underline uppercase tracking-wider"
            >
              Reset
            </button>
          </div>

          {/* Specialties Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
              Food Specialty
            </label>
            <div className="flex flex-col gap-1.5">
              {allSpecialties.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                    selectedSpecialty === spec
                      ? "bg-emerald-600 text-white border-emerald-600 font-semibold"
                      : "bg-white text-emerald-800 border-emerald-100/80 hover:bg-emerald-50/50"
                  }`}
                >
                  {spec === "All" ? "All Specialty Styles" : spec}
                </button>
              ))}
            </div>
          </div>

          {/* Service Area Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
              Service Area / metro
            </label>
            <div className="flex flex-col gap-1.5">
              {allAreas.map((area) => (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                    selectedArea === area
                      ? "bg-emerald-600 text-white border-emerald-600 font-semibold"
                      : "bg-white text-emerald-800 border-emerald-100/80 hover:bg-emerald-50/50"
                  }`}
                >
                  {area === "All" ? "All Locations" : area}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
                Max Per-Hour Rate
              </label>
              <span className="text-xs font-bold text-emerald-700">₹{maxPrice}/hr</span>
            </div>
            <input
              type="range"
              min="300"
              max="1000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>₹300/hr</span>
              <span>₹1000/hr</span>
            </div>
          </div>
        </div>

        {/* Search Results Side */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Sort Controls */}
          <div className="bg-white border border-slate-100 px-5 py-4 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-center shadow-2xs">
            <span className="text-xs text-slate-500 font-semibold">
              Available Partners: <strong className="text-emerald-800">{filteredChefs.length}</strong> qualified private chefs
            </span>
            <div className="flex items-center gap-2">
              <label htmlFor="sort-dropdown" className="text-xs font-bold text-slate-700 uppercase tracking-wider">Sort:</label>
              <select
                id="sort-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-bold text-emerald-800 bg-emerald-50/80 border border-emerald-200 rounded-xl px-3 py-2 cursor-pointer focus:ring-1 focus:ring-emerald-500"
              >
                <option value="rating-desc">★ Rating: High to Low</option>
                <option value="price-asc">Rate: Low to High</option>
                <option value="price-desc">Rate: High to Low</option>
                <option value="experience-desc">Experience: High to Low</option>
              </select>
            </div>
          </div>

          {/* Chefs Cards Grid */}
          {filteredChefs.length === 0 ? (
            <div className="p-16 text-center bg-white border border-slate-100 rounded-3xl shadow-2xs">
              <h3 className="text-base font-bold text-slate-800 mb-2">No Matching Chefs Located</h3>
              <p className="text-xs text-slate-455 max-w-sm mx-auto leading-relaxed font-semibold">
                Adjust the sliding budget selector, expand specialties filter, or try searching for another suburb.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredChefs.map(chef => (
                <ChefCard 
                  key={chef.id} 
                  chef={chef} 
                  onSelect={onSelectChef} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
