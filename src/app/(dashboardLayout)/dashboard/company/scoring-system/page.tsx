"use client";
 
import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Scale, 
  Users, 
  Calendar, 
  Shield, 
  Fuel, 
  Star, 
  Wrench, 
  Edit3, 
  X,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { createPortal } from "react-dom";
 
// Initial mock scoring system categories matching the user's mockup
const INITIAL_CATEGORIES = [
  { id: "safety", name: "Safety Score", description: "Driving safety and compliance", weight: 30, range: "0 - 100", type: "safety" },
  { id: "fuel", name: "Fuel Efficiency", description: "Fuel usage and efficiency", weight: 25, range: "0 - 100", type: "fuel" },
  { id: "attendance", name: "Attendance", description: "Punctuality and availability", weight: 20, range: "0 - 100", type: "attendance" },
  { id: "feedback", name: "Customer Feedback", description: "Customer ratings and feedback", weight: 15, range: "0 - 100", type: "feedback" },
  { id: "maintenance", name: "Vehicle Maintenance", description: "Vehicle condition and upkeep", weight: 10, range: "0 - 100", type: "maintenance" }
];
 
export default function CompanyScoringSystemPage() {
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [totalWeight, setTotalWeight] = useState(100);
 
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editRange, setEditRange] = useState("");
  const [editWeight, setEditWeight] = useState(0);
 
  useEffect(() => {
    setMounted(true);
  }, []);
 
  // Recalculate total weight whenever category weights change
  useEffect(() => {
    const sum = categories.reduce((acc, cat) => acc + cat.weight, 0);
    setTotalWeight(sum);
  }, [categories]);
 
  if (!mounted) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center text-gray-400 font-medium">
        Loading Scoring System...
      </div>
    );
  }
 
  // Handle direct weight changes in the list inputs
  const handleWeightChange = (id: string, newWeight: number) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, weight: Math.max(0, Math.min(100, newWeight)) } : cat
    ));
  };
 
  // Open modal with pre-filled fields
  const handleOpenEditModal = (cat: any) => {
    setSelectedCategory(cat);
    setEditName(cat.name);
    setEditDescription(cat.description);
    setEditRange(cat.range);
    setEditWeight(cat.weight);
    setIsEditModalOpen(true);
  };
 
  // Save from Edit Modal
  const handleSaveModalConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;
 
    setCategories(categories.map(cat => 
      cat.id === selectedCategory.id 
        ? { ...cat, name: editName, description: editDescription, range: editRange, weight: editWeight } 
        : cat
    ));
    setIsEditModalOpen(false);
    toast.success(`${editName} updated successfully.`);
  };
 
  // Save Changes configuration
  const handleSaveChanges = () => {
    if (totalWeight !== 100) {
      toast.error("Total weight must equal exactly 100% to save.");
      return;
    }
    toast.success("Scoring weights saved and successfully applied.");
  };
 
  // Helper to render dynamic category color & icons
  const renderCategoryIcon = (type: string) => {
    switch (type) {
      case "safety":
        return (
          <div className="w-10 h-10 rounded-xl bg-red-50 text-[#D13900] flex items-center justify-center shrink-0 shadow-sm border border-red-100/50">
            <Shield className="w-5 h-5" />
          </div>
        );
      case "fuel":
        return (
          <div className="w-10 h-10 rounded-xl bg-green-50 text-[#008A45] flex items-center justify-center shrink-0 shadow-sm border border-green-100/50">
            <Fuel className="w-5 h-5" />
          </div>
        );
      case "attendance":
        return (
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#FAAD14] flex items-center justify-center shrink-0 shadow-sm border border-amber-100/50">
            <Calendar className="w-5 h-5" />
          </div>
        );
      case "feedback":
        return (
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-sm border border-blue-100/50">
            <Star className="w-5 h-5" />
          </div>
        );
      case "maintenance":
        return (
          <div className="w-10 h-10 rounded-xl bg-[#FFEBEB] text-[#D13900] flex items-center justify-center shrink-0 shadow-sm border border-red-100/50">
            <Wrench className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center shrink-0 border border-gray-100">
            <FileText className="w-5 h-5" />
          </div>
        );
    }
  };
 
  const isWeightValid = totalWeight === 100;
 
  return (
    <div className="w-full space-y-6 font-poppins pb-12 select-text animate-fade-in">
      
      {/* Overview Aggregations Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Categories Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categories</p>
            <p className="text-3xl font-black text-gray-900 leading-none">{categories.length}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#D13900] flex items-center justify-center text-white shadow-sm shrink-0">
            <FileText className="w-5.5 h-5.5" />
          </div>
        </div>
 
        {/* Total Weight Card (Dynamic Warning colors) */}
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
            <p className="text-lg font-black text-gray-900 leading-none mt-1">May 27,2026</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm shrink-0">
            <Calendar className="w-5.5 h-5.5" />
          </div>
        </div>
 
      </div>
 
      {/* Category Settings Config Card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        
        {/* Responsive Table Container */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-wider">
                <th className="pb-4 font-black">Category</th>
                <th className="pb-4 font-black text-center pl-10 w-44">Weight (%)</th>
                <th className="pb-4 font-black text-center w-48">Scoring Range</th>
                <th className="pb-4 text-right font-black pr-4 w-28">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                  
                  {/* Category Details */}
                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      {renderCategoryIcon(cat.type)}
                      <div className="text-left">
                        <p className="text-xs font-extrabold text-gray-900 leading-tight">{cat.name}</p>
                        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{cat.description}</p>
                      </div>
                    </div>
                  </td>
                  
                  {/* Weight Input Box */}
                  <td className="py-5 text-center">
                    <div className="flex items-center border border-gray-250 rounded-lg overflow-hidden w-24 mx-auto bg-[#FAFAFA] focus-within:ring-1 focus-within:ring-[#D13900] focus-within:border-[#D13900]">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={cat.weight}
                        onChange={(e) => handleWeightChange(cat.id, parseInt(e.target.value) || 0)}
                        className="w-14 px-2 py-1.5 focus:outline-none text-center font-bold text-xs bg-white text-gray-800"
                      />
                      <div className="bg-gray-50 border-l border-gray-200 px-2.5 py-1.5 text-[10px] font-bold text-gray-400 select-none">
                        %
                      </div>
                    </div>
                  </td>
                  
                  {/* Scoring Range */}
                  <td className="py-5 text-center text-gray-500 font-bold">
                    {cat.range}
                  </td>
                  
                  {/* Edit Action Button */}
                  <td className="py-5 text-right pr-4">
                    <button 
                      onClick={() => handleOpenEditModal(cat)}
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
 
        {/* Footer controls row */}
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
 
          {/* Validation Notice Alert Banner */}
          <div className="border border-[#FDE8E8] bg-[#FDF2F2] rounded-2xl p-4 flex items-start gap-2.5 text-[#D13900] text-xs font-semibold leading-relaxed">
            <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
            <p className="text-left font-bold">Changes will be applied to all future score calculations.</p>
          </div>
        </div>
 
      </div>
 
      {/* ----------------- MODALS ----------------- */}
 
      {/* Edit Scoring System modal dialog */}
      {isEditModalOpen && selectedCategory && mounted && createPortal(
        <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-9999 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-[480px] p-8 shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in-95 duration-200 text-left">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-full hover:bg-gray-50"
            >
              <X className="w-5 h-5" />
            </button>
 
            <h3 className="text-xl font-black text-gray-900 mb-6">Edit Scoring System</h3>
            
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
                <label className="block text-xs font-bold text-[#121212]">Score Range</label>
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
 
              {/* Action buttons */}
              <button
                type="submit"
                className="px-6 py-3.5 bg-[#D13900] hover:bg-[#b23000] text-white font-bold text-xs rounded-xl shadow-sm hover:shadow transition-all cursor-pointer mt-2"
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
