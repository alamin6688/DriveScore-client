"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Scale,
  Users,
  Calendar,
  Shield,
  Award,
  ChevronDown,
  X,
  Gauge,
  ShieldAlert,
  AlertTriangle,
  Compass,
  MapPin,
  Headphones,
  Truck,
  Image as ImageIcon,
  Package,
  Sparkles,
  Edit3,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { createPortal } from "react-dom";

// Initial mock safety metrics data
const INITIAL_SAFETY_METRICS = [
  {
    id: "s1",
    name: "Speeding",
    description: "Speeding incidents",
    weight: 30,
    range: "0 - 100",
    icon: <Gauge className="w-5 h-5" />,
    colorClass: "bg-red-50 text-red-500 border border-red-100/50",
  },
  {
    id: "s2",
    name: "Seatbelt Off",
    description: "Seatbelt off incidents",
    weight: 25,
    range: "0 - 100",
    icon: <ShieldAlert className="w-5 h-5" />,
    colorClass: "bg-green-50 text-green-600 border border-green-100/50",
  },
  {
    id: "s3",
    name: "Distractions",
    description: "Distracted driving incidents",
    weight: 20,
    range: "0 - 100",
    icon: <AlertTriangle className="w-5 h-5" />,
    colorClass: "bg-red-50 text-red-500 border border-red-100/50",
  },
  {
    id: "s4",
    name: "Sign/Signal Violations",
    description: "Turn signal & sign violations",
    weight: 15,
    range: "0 - 100",
    icon: <Compass className="w-5 h-5" />,
    colorClass: "bg-amber-50 text-amber-500 border border-amber-100/50",
  },
  {
    id: "s5",
    name: "Following Distance",
    description: "Following distance incidents",
    weight: 10,
    range: "0 - 100",
    icon: <MapPin className="w-5 h-5" />,
    colorClass: "bg-purple-50 text-purple-500 border border-purple-100/50",
  },
];

// Initial mock quality metrics data
const INITIAL_QUALITY_METRICS = [
  {
    id: "q1",
    name: "Customer Feedback (CDF)",
    description: "Customer satisfaction rating",
    weight: 30,
    range: "0 - 100",
    icon: <Headphones className="w-5 h-5" />,
    colorClass: "bg-red-50 text-red-500 border border-red-100/50",
  },
  {
    id: "q2",
    name: "Delivery Completion (DPMO)",
    description: "Defects per million opportunities",
    weight: 25,
    range: "0 - 100",
    icon: <Truck className="w-5 h-5" />,
    colorClass: "bg-green-50 text-green-600 border border-green-100/50",
  },
  {
    id: "q3",
    name: "Delivery Success Behavior (DSB)",
    description: "Delivery success behavior score",
    weight: 20,
    range: "0 - 100",
    icon: <Sparkles className="w-5 h-5" />,
    colorClass: "bg-red-50 text-red-500 border border-red-100/50",
  },
  {
    id: "q4",
    name: "POD Photos",
    description: "Proof of delivery photos",
    weight: 15,
    range: "0 - 100",
    icon: <ImageIcon className="w-5 h-5" />,
    colorClass: "bg-amber-50 text-amber-500 border border-amber-100/50",
  },
  {
    id: "q5",
    name: "Package Delivered",
    description: "Packages",
    weight: 10,
    range: "0 - 100",
    icon: <Package className="w-5 h-5" />,
    colorClass: "bg-purple-50 text-purple-500 border border-purple-100/50",
  },
];

export default function CompanyScoringSystemPage() {
  const [mounted, setMounted] = useState(false);

  // Active category type: "safety" or "quality"
  const [activeType, setActiveType] = useState<"safety" | "quality">("safety");
  const [metricDropdownOpen, setMetricDropdownOpen] = useState(false);

  // Metrics lists states
  const [safetyMetrics, setSafetyMetrics] = useState(INITIAL_SAFETY_METRICS);
  const [qualityMetrics, setQualityMetrics] = useState(INITIAL_QUALITY_METRICS);

  // Edit Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editRange, setEditRange] = useState("");
  const [editWeight, setEditWeight] = useState(0);

  // Track page calculations
  const [totalWeight, setTotalWeight] = useState(100);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update total weight whenever metrics state changes
  useEffect(() => {
    const activeList = activeType === "safety" ? safetyMetrics : qualityMetrics;
    const sum = activeList.reduce((acc, metric) => acc + metric.weight, 0);
    setTotalWeight(sum);
  }, [activeType, safetyMetrics, qualityMetrics]);

  if (!mounted) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center text-gray-400 font-medium">
        Loading Scoring System...
      </div>
    );
  }

  // Handle direct weight changes in the list inputs
  const handleWeightChange = (id: string, newWeight: number) => {
    const parsedWeight = Math.max(0, Math.min(100, newWeight));
    if (activeType === "safety") {
      setSafetyMetrics(
        safetyMetrics.map((m) => (m.id === id ? { ...m, weight: parsedWeight } : m))
      );
    } else {
      setQualityMetrics(
        qualityMetrics.map((m) => (m.id === id ? { ...m, weight: parsedWeight } : m))
      );
    }
  };

  // Open Edit Modal with pre-filled values
  const handleOpenEditModal = (metric: any) => {
    setSelectedMetric(metric);
    setEditName(metric.name);
    setEditDescription(metric.description);
    setEditRange(metric.range);
    setEditWeight(metric.weight);
    setIsEditModalOpen(true);
  };

  // Save changes from Edit Modal
  const handleSaveModalConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMetric) return;

    if (activeType === "safety") {
      setSafetyMetrics(
        safetyMetrics.map((m) =>
          m.id === selectedMetric.id
            ? {
                ...m,
                name: editName,
                description: editDescription,
                range: editRange,
                weight: editWeight,
              }
            : m
        )
      );
    } else {
      setQualityMetrics(
        qualityMetrics.map((m) =>
          m.id === selectedMetric.id
            ? {
                ...m,
                name: editName,
                description: editDescription,
                range: editRange,
                weight: editWeight,
              }
            : m
        )
      );
    }
    setIsEditModalOpen(false);
    toast.success(`${editName} updated successfully.`);
  };

  // Main save scoring weights
  const handleSaveChanges = () => {
    if (totalWeight !== 100) {
      toast.error("Total weight must equal exactly 100% to save changes.");
      return;
    }
    toast.success(
      `Scoring weights for ${
        activeType === "safety" ? "Safety" : "Quality"
      } successfully saved and applied.`
    );
  };

  const isWeightValid = totalWeight === 100;
  const activeMetricsList = activeType === "safety" ? safetyMetrics : qualityMetrics;

  return (
    <div className="w-full space-y-6 font-poppins pb-12 select-text animate-fade-in text-left">
      
      {/* Aggregations Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Categories Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categories</p>
            <p className="text-3xl font-black text-gray-900 leading-none">5</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#D13900] flex items-center justify-center text-white shadow-sm shrink-0">
            <FileText className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* Total Weight Card (Warning color active if not 100%) */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Weight</p>
            <p className={`text-3xl font-black leading-none ${isWeightValid ? "text-gray-900" : "text-[#FF3B30]"}`}>
              {totalWeight}%
            </p>
            {!isWeightValid && (
              <p className="text-[10px] text-[#FF3B30] font-bold pt-1 select-none">Must equal 100%</p>
            )}
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-sm shrink-0 transition-colors duration-300 ${isWeightValid ? "bg-[#008A45]" : "bg-[#FF3B30]"}`}>
            <Scale className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* Drivers Affected Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Drivers Affected</p>
            <p className="text-3xl font-black text-gray-900 leading-none">48</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#D13900] flex items-center justify-center text-white shadow-sm shrink-0">
            <Users className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* Last Updated Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Last Updated</p>
            <p className="text-lg font-black text-gray-900 leading-none mt-1">May 27, 2026</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm shrink-0">
            <Calendar className="w-5.5 h-5.5" />
          </div>
        </div>

      </div>

      {/* Main Scoring System Config Table Card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        
        {/* Metric Selector Dropdown and Header columns */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative">
            <button 
              onClick={() => setMetricDropdownOpen(!metricDropdownOpen)}
              className="bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm select-none"
            >
              <span className="capitalize">{activeType === "safety" ? "Metrics" : "Quality"}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${metricDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            
            {metricDropdownOpen && (
              <div className="absolute left-0 mt-1 bg-white border border-gray-150 rounded-xl shadow-lg py-1.5 z-30 w-32 select-none animate-in fade-in zoom-in-95 duration-100 text-left">
                <button
                  onClick={() => {
                    setActiveType("safety");
                    setMetricDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-xs font-semibold text-gray-650 hover:bg-gray-50 transition-colors ${activeType === "safety" ? "text-[#D13900] bg-red-50/15" : ""}`}
                >
                  Safety
                </button>
                <button
                  onClick={() => {
                    setActiveType("quality");
                    setMetricDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-xs font-semibold text-gray-655 hover:bg-gray-50 transition-colors ${activeType === "quality" ? "text-[#D13900] bg-red-50/15" : ""}`}
                >
                  Quality
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Table representation of scoring list */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-wider">
                <th className="pb-4 font-black">Metric</th>
                <th className="pb-4 font-black text-center pl-10 w-44">Weight (%)</th>
                <th className="pb-4 font-black text-center w-48">Scoring Range</th>
                <th className="pb-4 text-right font-black pr-4 w-28">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">
              {activeMetricsList.map((metric) => (
                <tr key={metric.id} className="hover:bg-gray-50/50 transition-colors">
                  
                  {/* Metric details and color code */}
                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${metric.colorClass}`}>
                        {metric.icon}
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-extrabold text-gray-900 leading-tight">{metric.name}</p>
                        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{metric.description}</p>
                      </div>
                    </div>
                  </td>
                  
                  {/* Weight edit input box */}
                  <td className="py-5 text-center">
                    <div className="flex items-center border border-gray-250 rounded-lg overflow-hidden w-24 mx-auto bg-[#FAFAFA] focus-within:ring-1 focus-within:ring-[#D13900] focus-within:border-[#D13900]">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={metric.weight}
                        onChange={(e) => handleWeightChange(metric.id, parseInt(e.target.value) || 0)}
                        className="w-14 px-2 py-1.5 focus:outline-none text-center font-bold text-xs bg-white text-gray-800"
                      />
                      <div className="bg-gray-50 border-l border-gray-200 px-2.5 py-1.5 text-[10px] font-bold text-gray-400 select-none">
                        %
                      </div>
                    </div>
                  </td>

                  {/* Range representation */}
                  <td className="py-5 text-center text-gray-500 font-bold">
                    {metric.range}
                  </td>

                  {/* Action Pen Trigger */}
                  <td className="py-5 text-right pr-4">
                    <button
                      onClick={() => handleOpenEditModal(metric)}
                      className="w-8 h-8 rounded-lg border border-red-150 hover:bg-red-50/20 text-[#D13900] flex items-center justify-center cursor-pointer transition-colors align-middle"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Save and warning action row */}
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex justify-end select-none">
            <button
              onClick={handleSaveChanges}
              disabled={!isWeightValid}
              className={`font-extrabold text-xs px-6 py-3 rounded-full cursor-pointer shadow-sm transition-all text-white ${
                isWeightValid
                  ? "bg-[#D13900] hover:bg-[#b23000] hover:shadow"
                  : "bg-red-300 opacity-60 cursor-not-allowed"
              }`}
            >
              Save Changes
            </button>
          </div>

          <div className="border border-[#FDE8E8] bg-[#FDF2F2] rounded-2xl p-4 flex items-start gap-2.5 text-[#D13900] text-xs font-semibold leading-relaxed">
            <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
            <p className="text-left font-bold">Changes will be applied to all future score calculations.</p>
          </div>
        </div>

      </div>

      {/* ----------------- EDIT SCORING SYSTEM MODAL ----------------- */}
      {isEditModalOpen && selectedMetric && mounted && createPortal(
        <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-9999 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-[480px] p-8 shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in-95 duration-200 text-left"
               onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-full hover:bg-gray-50"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-gray-900 mb-6 border-b border-gray-50 pb-4">Edit Scoring System</h3>
            
            <form onSubmit={handleSaveModalConfig} className="space-y-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Customize</p>
              
              {/* Category Name Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-800">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="Category Name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FAFAFA] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-transparent text-xs text-gray-855 placeholder-gray-400 font-semibold transition-all"
                />
              </div>

              {/* Category Description Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-800">Category Description</label>
                <input
                  type="text"
                  required
                  placeholder="Category Description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FAFAFA] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-transparent text-xs text-gray-855 placeholder-gray-400 font-semibold transition-all"
                />
              </div>

              {/* Score Range Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-800">Score Range</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 0 - 100"
                  value={editRange}
                  onChange={(e) => setEditRange(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FAFAFA] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-transparent text-xs text-gray-855 placeholder-gray-400 font-semibold transition-all"
                />
              </div>

              {/* Weight Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-800">Weight</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  placeholder="Weight Percentage"
                  value={editWeight}
                  onChange={(e) => setEditWeight(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-[#FAFAFA] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-transparent text-xs text-gray-850 placeholder-gray-400 font-semibold transition-all"
                />
              </div>

              {/* Save submit */}
              <button
                type="submit"
                className="px-6 py-3 bg-[#D13900] hover:bg-[#b23000] text-white font-bold text-xs rounded-xl shadow-sm hover:shadow transition-all cursor-pointer mt-2"
              >
                Save
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
