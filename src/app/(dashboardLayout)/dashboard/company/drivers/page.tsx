"use client";
 
import React, { useState, useEffect, useRef } from "react";
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  X, 
  Mail, 
  User, 
  Hash,
  ArrowUpRight, 
  ArrowDownRight,
  Info,
  Clock,
  Archive,
  MoreVertical
} from "lucide-react";
import { createPortal } from "react-dom";
 
// Initial mock drivers data matching the user's mockup
const INITIAL_DRIVERS = [
  { id: "1", name: "Daniel Carter", email: "Daniel.Carter@gmail.com", company: "Alpha Fleet", standing: "Platinum", score: 93.8, change: "+8 From last week", isPositive: true, associateId: "DRV-9931" },
  { id: "2", name: "Daniel Carter", email: "Daniel.Carter@gmail.com", company: "Alpha Fleet", standing: "Platinum", score: 93.8, change: "+8 From last week", isPositive: true, associateId: "DRV-9932" },
  { id: "3", name: "Daniel Carter", email: "Daniel.Carter@gmail.com", company: "Alpha Fleet", standing: "Platinum", score: 93.8, change: "+8 From last week", isPositive: true, associateId: "DRV-9933" },
  { id: "4", name: "Daniel Carter", email: "Daniel.Carter@gmail.com", company: "Alpha Fleet", standing: "Platinum", score: 93.8, change: "+8 From last week", isPositive: true, associateId: "DRV-9934" },
  { id: "5", name: "Daniel Carter", email: "Daniel.Carter@gmail.com", company: "Alpha Fleet", standing: "Platinum", score: 93.8, change: "+8 From last week", isPositive: true, associateId: "DRV-9935" },
  { id: "6", name: "Daniel Carter", email: "Daniel.Carter@gmail.com", company: "Alpha Fleet", standing: "Gold", score: 78.4, change: "-4 From last week", isPositive: false, associateId: "DRV-9936" },
  { id: "7", name: "Daniel Carter", email: "Daniel.Carter@gmail.com", company: "Alpha Fleet", standing: "Gold", score: 78.4, change: "-4 From last week", isPositive: false, associateId: "DRV-9937" },
  { id: "8", name: "Daniel Carter", email: "Daniel.Carter@gmail.com", company: "Alpha Fleet", standing: "Gold", score: 78.4, change: "-4 From last week", isPositive: false, associateId: "DRV-9938" },
  { id: "9", name: "Daniel Carter", email: "Daniel.Carter@gmail.com", company: "Alpha Fleet", standing: "Gold", score: 78.4, change: "-4 From last week", isPositive: false, associateId: "DRV-9939" },
  { id: "10", name: "Daniel Carter", email: "Daniel.Carter@gmail.com", company: "Alpha Fleet", standing: "Gold", score: 78.4, change: "-4 From last week", isPositive: false, associateId: "DRV-9940" },
];
 
export default function CompanyDriversPage() {
  const [mounted, setMounted] = useState(false);
  const [drivers, setDrivers] = useState(INITIAL_DRIVERS);
  const [searchQuery, setSearchQuery] = useState("");
 
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  
  // Add driver form state
  const [newDriverName, setNewDriverName] = useState("");
  const [newDriverEmail, setNewDriverEmail] = useState("");
  const [newDriverAssociateId, setNewDriverAssociateId] = useState("");
 
  // Action menu state
  const [activeMenuDriverId, setActiveMenuDriverId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLTableDataCellElement>(null);
 
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
 
  // Search query sync with Layout URL search params
  useEffect(() => {
    setMounted(true);
    const syncSearch = () => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        setSearchQuery(params.get("search") || "");
        setCurrentPage(1); // reset to first page on search
      }
    };
 
    syncSearch(); // initial load
    window.addEventListener("searchChange", syncSearch);
    window.addEventListener("popstate", syncSearch);
    return () => {
      window.removeEventListener("searchChange", syncSearch);
      window.removeEventListener("popstate", syncSearch);
    };
  }, []);
 
  // Handle click outside to close actions menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveMenuDriverId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
 
  if (!mounted) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center text-gray-400 font-medium">
        Loading Drivers...
      </div>
    );
  }
 
  // Filter drivers based on search input
  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.standing.toLowerCase().includes(searchQuery.toLowerCase())
  );
 
  // Paginate list
  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDrivers = filteredDrivers.slice(startIndex, startIndex + itemsPerPage);
 
  // Handle Add Driver
  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriverName || !newDriverEmail || !newDriverAssociateId) return;
 
    const newDriverObj = {
      id: Date.now().toString(),
      name: newDriverName,
      email: newDriverEmail,
      company: "Alpha Fleet",
      standing: "Gold", // Default starting standing
      score: 82.5,
      change: "+0 From last week",
      isPositive: true,
      associateId: newDriverAssociateId
    };
 
    setDrivers([newDriverObj, ...drivers]);
    
    // Reset Form & Close
    setNewDriverName("");
    setNewDriverEmail("");
    setNewDriverAssociateId("");
    setIsAddModalOpen(false);
  };
 
  // Handle Delete Driver
  const handleDeleteDriver = (id: string) => {
    setDrivers(drivers.filter(d => d.id !== id));
    setActiveMenuDriverId(null);
  };
 
  // Handle Open View Details
  const handleOpenViewDetails = (driver: any) => {
    setSelectedDriver(driver);
    setIsViewModalOpen(true);
    setActiveMenuDriverId(null);
  };
 
  return (
    <div className="w-full space-y-6 font-poppins pb-12 select-text animate-fade-in">
      
      {/* Visual KPI Stats Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Total Drivers */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Drivers</p>
            <p className="text-3xl font-black text-gray-900 leading-none">248</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#D13900] flex items-center justify-center text-white shrink-0">
            <Users className="w-5.5 h-5.5" />
          </div>
        </div>
 
        {/* Active Drivers */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Drivers</p>
            <p className="text-3xl font-black text-gray-900 leading-none">110</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#008A45] flex items-center justify-center text-white shrink-0">
            <Users className="w-5.5 h-5.5" />
          </div>
        </div>
 
        {/* Inactive Drivers */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Inactive Drivers</p>
            <p className="text-3xl font-black text-gray-900 leading-none">110</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#FAAD14] flex items-center justify-center text-white shrink-0">
            <Archive className="w-5.5 h-5.5" />
          </div>
        </div>
 
        {/* On Leave */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">On Leave</p>
            <p className="text-3xl font-black text-gray-900 leading-none">10</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#D13900] flex items-center justify-center text-white shrink-0">
            <Clock className="w-5.5 h-5.5" />
          </div>
        </div>
      </div>
 
      {/* Drivers List Card Table */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        
        {/* Card Header row */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-black text-gray-900">Drivers List</h3>
          
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#D13900] hover:bg-[#b23000] text-white font-bold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow transition-all"
          >
            <span>Add Driver</span>
            <Plus className="w-4 h-4" />
          </button>
        </div>
 
        {/* Responsive Table Container */}
        <div className="overflow-x-auto w-full -mx-6 px-6">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-wider">
                <th className="pb-4 font-black">Driver Name</th>
                <th className="pb-4 font-black">Email Address</th>
                <th className="pb-4 font-black">Company Name</th>
                <th className="pb-4 font-black">Overall Standing</th>
                <th className="pb-4 font-black">Overall Score</th>
                <th className="pb-4 text-left font-black pr-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">
              {paginatedDrivers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 font-bold">
                    No drivers found.
                  </td>
                </tr>
              ) : (
                paginatedDrivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Name */}
                    <td className="py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center shrink-0">
                          {driver.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="font-bold text-gray-900">{driver.name}</span>
                      </div>
                    </td>
                    {/* Email */}
                    <td className="py-4 text-gray-500">{driver.email}</td>
                    {/* Company */}
                    <td className="py-4 text-gray-500">{driver.company}</td>
                    {/* Standing */}
                    <td className="py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold ${
                        driver.standing === "Platinum"
                          ? "bg-slate-100 text-slate-700 border border-slate-200"
                          : "bg-amber-50 text-amber-700 border border-amber-100"
                      }`}>
                        {driver.standing}
                      </span>
                    </td>
                    {/* Score & Growth */}
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-gray-900">{driver.score}</span>
                        <div className={`flex items-center text-[10px] font-bold ${driver.isPositive ? "text-[#008A45]" : "text-[#FF3B30]"}`}>
                          {driver.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          <span>{driver.change}</span>
                        </div>
                      </div>
                    </td>
                    {/* Action button */}
                    <td className="py-4 text-right relative pr-3" ref={activeMenuDriverId === driver.id ? dropdownRef : null}>
                      <button 
                        onClick={() => setActiveMenuDriverId(activeMenuDriverId === driver.id ? null : driver.id)}
                        className="w-7 h-7 rounded-full border border-red-150 hover:bg-red-50/20 text-[#D13900] flex items-center justify-center cursor-pointer transition-colors align-middle"
                      >
                        <Info className="w-4 h-4" />
                      </button>
 
                      {/* Interactive Float Action Dropdown */}
                      {activeMenuDriverId === driver.id && (
                        <div className="absolute right-4 top-12 bg-white border border-gray-150 rounded-2xl shadow-xl z-20 w-28 p-2 flex flex-col gap-1 select-none animate-in fade-in slide-in-from-top-2 duration-150 text-left">
                          <button 
                            onClick={() => handleOpenViewDetails(driver)}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => handleDeleteDriver(driver.id)}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#FF3B30] hover:bg-[#FFEBEB] transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
 
        {/* Table Pagination row */}
        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-2 mt-6 select-none text-xs">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-gray-200 rounded-lg font-bold text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isActive = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center transition-colors cursor-pointer ${
                    isActive 
                      ? "bg-[#D13900] text-white" 
                      : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
 
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-gray-200 rounded-lg font-bold text-[#D13900] hover:bg-red-50/10 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>
 
      {/* ----------------- MODALS ----------------- */}
 
      {/* Add New Driver Modal */}
      {isAddModalOpen && mounted && createPortal(
        <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-9999 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-[480px] p-8 shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in-95 duration-200 text-left">
            {/* Close Button */}
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-full hover:bg-gray-50"
            >
              <X className="w-5 h-5" />
            </button>
 
            <h3 className="text-xl font-black text-gray-900 mb-6">Add New Driver</h3>
            
            <form onSubmit={handleAddDriver} className="space-y-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Personal Information</p>
              
              {/* Name Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-800">Name</label>
                <div className="relative flex items-center">
                  <User className="absolute left-4 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="Enter Driver Name"
                    value={newDriverName}
                    onChange={(e) => setNewDriverName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-transparent text-xs text-gray-855 placeholder-gray-400 font-semibold transition-all"
                  />
                </div>
              </div>
 
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-800">Email</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="Enter Driver email"
                    value={newDriverEmail}
                    onChange={(e) => setNewDriverEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-transparent text-xs text-gray-855 placeholder-gray-400 font-semibold transition-all"
                  />
                </div>
              </div>
 
              {/* Associate ID Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-800">Associate ID</label>
                <div className="relative flex items-center">
                  <Hash className="absolute left-4 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="Driver Associate ID"
                    value={newDriverAssociateId}
                    onChange={(e) => setNewDriverAssociateId(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-transparent text-xs text-gray-855 placeholder-gray-400 font-semibold transition-all"
                  />
                </div>
              </div>
 
              {/* Save button */}
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
 
      {/* View Driver Details Modal */}
      {isViewModalOpen && selectedDriver && mounted && createPortal(
        <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-9999 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-[480px] p-8 shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in-95 duration-200 text-left">
            {/* Close Button */}
            <button 
              onClick={() => setIsViewModalOpen(false)}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-full hover:bg-gray-50"
            >
              <X className="w-5 h-5" />
            </button>
 
            <h3 className="text-xl font-black text-gray-900 mb-6 border-b border-gray-50 pb-4">Driver Details</h3>
 
            <div className="space-y-4 text-xs font-semibold text-gray-855">
              <div>
                <span className="text-gray-500 font-bold">Name : </span>
                <span className="text-gray-900 font-extrabold">{selectedDriver.name}</span>
              </div>
              <div>
                <span className="text-gray-500 font-bold">Email Address : </span>
                <span className="text-gray-900 font-extrabold">{selectedDriver.email}</span>
              </div>
              <div>
                <span className="text-gray-500 font-bold">Company Name : </span>
                <span className="text-gray-900 font-extrabold">{selectedDriver.company}</span>
              </div>
              <div>
                <span className="text-gray-500 font-bold">Overall Standing : </span>
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  selectedDriver.standing === "Platinum"
                    ? "bg-slate-100 text-slate-700 border border-slate-200"
                    : "bg-amber-50 text-amber-700 border border-amber-100"
                }`}>
                  {selectedDriver.standing}
                </span>
              </div>
              <div>
                <span className="text-gray-500 font-bold">Overall Score : </span>
                <span className="text-gray-900 font-extrabold">{selectedDriver.score}</span>
              </div>
              {selectedDriver.associateId && (
                <div>
                  <span className="text-gray-500 font-bold">Associate ID : </span>
                  <span className="text-gray-900 font-extrabold">{selectedDriver.associateId}</span>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
 
    </div>
  );
}
