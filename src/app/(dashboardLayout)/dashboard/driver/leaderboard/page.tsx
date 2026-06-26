"use client";

import React, { useState, useEffect } from "react";
import {
  Trophy,
  ChevronDown,
  Download,
  Eye,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Zap,
} from "lucide-react";
import { createPortal } from "react-dom";

// Initial mock drivers leaderboard data matching the user's mockup
const INITIAL_LEADERBOARD = [
  {
    id: "1",
    rank: 1,
    name: "Daniel Carter",
    email: "Daniel.Carter@gmail.com",
    company: "Alpha Fleet",
    standing: "Platinum",
    score: 93.8,
    change: "+8 From last week",
    isPositive: true,
  },
  {
    id: "2",
    rank: 2,
    name: "Daniel Carter",
    email: "Daniel.Carter@gmail.com",
    company: "Alpha Fleet",
    standing: "Platinum",
    score: 93.8,
    change: "+5 From last week",
    isPositive: true,
  },
  {
    id: "3",
    rank: 3,
    name: "Daniel Carter",
    email: "Daniel.Carter@gmail.com",
    company: "Alpha Fleet",
    standing: "Platinum",
    score: 93.8,
    change: "+8 From last week",
    isPositive: true,
  },
  {
    id: "4",
    rank: 4,
    name: "Daniel Carter",
    email: "Daniel.Carter@gmail.com",
    company: "Alpha Fleet",
    standing: "Platinum",
    score: 93.8,
    change: "+6 From last week",
    isPositive: true,
  },
  {
    id: "5",
    rank: 5,
    name: "Daniel Carter",
    email: "Daniel.Carter@gmail.com",
    company: "Alpha Fleet",
    standing: "Platinum",
    score: 93.8,
    change: "+5 From last week",
    isPositive: true,
  },
  {
    id: "6",
    rank: 6,
    name: "Daniel Carter",
    email: "Daniel.Carter@gmail.com",
    company: "Alpha Fleet",
    standing: "Platinum",
    score: 93.8,
    change: "+8 From last week",
    isPositive: true,
  },
  {
    id: "7",
    rank: 7,
    name: "Daniel Carter",
    email: "Daniel.Carter@gmail.com",
    company: "Alpha Fleet",
    standing: "Gold",
    score: 78.4,
    change: "-4 From last week",
    isPositive: false,
  },
  {
    id: "8",
    rank: 8,
    name: "Daniel Carter",
    email: "Daniel.Carter@gmail.com",
    company: "Alpha Fleet",
    standing: "Gold",
    score: 78.4,
    change: "-8 From last week",
    isPositive: false,
  },
  {
    id: "9",
    rank: 9,
    name: "Daniel Carter",
    email: "Daniel.Carter@gmail.com",
    company: "Alpha Fleet",
    standing: "Gold",
    score: 78.4,
    change: "-8 From last week",
    isPositive: false,
  },
];

export default function DriverLeaderboardPage() {
  const [mounted, setMounted] = useState(false);
  const [leaderboard] = useState(INITIAL_LEADERBOARD);

  // Weekly dropdown state
  const [selectedWeek, setSelectedWeek] = useState("Week 23");
  const [weekDropdownOpen, setWeekDropdownOpen] = useState(false);

  // Modal state
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center text-gray-400 font-medium">
        Loading Leaderboard...
      </div>
    );
  }

  // Paginate list
  const totalPages = Math.ceil(leaderboard.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLeaderboard = leaderboard.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Handle Open View Details
  const handleOpenViewDetails = (driver: any) => {
    setSelectedDriver(driver);
    setIsViewModalOpen(true);
  };

  // Helper to export CSV
  const handleExportCSV = () => {
    const headers = [
      "Rank",
      "Driver Name",
      "Email",
      "Company Name",
      "Standing",
      "Score",
      "Change",
    ];
    const rows = leaderboard.map((d) => [
      d.rank,
      d.name,
      d.email,
      d.company,
      d.standing,
      d.score,
      d.change,
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Leaderboard_${selectedWeek}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full space-y-6 font-poppins pb-12 select-text animate-fade-in text-left">
      {/* Top 3 For This Week Header Bar */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-900">
          Top 3 For This Week
        </h3>

        {/* Custom Week Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setWeekDropdownOpen(!weekDropdownOpen)}
            className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-xs px-4 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-colors shadow-sm select-none"
          >
            <span>{selectedWeek}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${weekDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {weekDropdownOpen && (
            <div className="absolute right-0 mt-1 bg-white border border-gray-150 rounded-xl shadow-lg py-1.5 z-30 w-32 select-none animate-in fade-in zoom-in-95 duration-100 text-left">
              {["Week 21", "Week 22", "Week 23", "Week 24"].map((week) => (
                <button
                  key={week}
                  onClick={() => {
                    setSelectedWeek(week);
                    setWeekDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors ${selectedWeek === week ? "text-[#D13900] bg-red-50/15" : ""}`}
                >
                  {week}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top 3 Performers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Champion (Green theme) */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#008A45] flex items-center justify-center text-white shrink-0 shadow-sm">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-gray-900 leading-tight">
                  Daniel Carter
                </p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                  Champion
                </p>
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900 leading-none pt-4">
              96.8
            </p>
          </div>
          <div className="absolute right-2 bottom-2 text-[#008A45]/5 pointer-events-none">
            <Sparkles className="w-24 h-24 stroke-1" />
          </div>
        </div>

        {/* Card 2: Rising Star (Orange theme) */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#FAAD14] flex items-center justify-center text-white shrink-0 shadow-sm">
                <Zap className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-gray-900 leading-tight">
                  Daniel Carter
                </p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                  Rising Star
                </p>
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900 leading-none pt-4">
              93.8
            </p>
          </div>
          <div className="absolute right-2 bottom-2 text-[#FAAD14]/5 pointer-events-none">
            <Sparkles className="w-24 h-24 stroke-1" />
          </div>
        </div>

        {/* Card 3: Most Improved (Purple theme) */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#722ED1] flex items-center justify-center text-white shrink-0 shadow-sm">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-gray-900 leading-tight">
                  Daniel Carter
                </p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                  Most Improved
                </p>
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900 leading-none pt-4">
              91.8
            </p>
          </div>
          <div className="absolute right-2 bottom-2 text-[#722ED1]/5 pointer-events-none">
            <Sparkles className="w-24 h-24 stroke-1" />
          </div>
        </div>
      </div>

      {/* Current Week Leaderboard Card Table */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        {/* Card Header row */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-black text-gray-900">
            Current Week Leaderboard
          </h3>

          <button
            onClick={handleExportCSV}
            className="bg-[#D13900] hover:bg-[#b23000] text-white font-bold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow transition-all"
          >
            <span>Export</span>
            <Download className="w-4 h-4" />
          </button>
        </div>

        {/* Responsive Table Container */}
        <div className="overflow-x-auto w-full -mx-6 px-6">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-wider">
                <th className="pb-4 font-black">Rank</th>
                <th className="pb-4 font-black">Driver Name</th>
                <th className="pb-4 font-black">Company Name</th>
                <th className="pb-4 font-black">Overall Standing</th>
                <th className="pb-4 font-black">Overall Score</th>
                <th className="pb-4 text-right font-black pr-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">
              {paginatedLeaderboard.map((driver) => (
                <tr
                  key={driver.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {/* Rank */}
                  <td className="py-4 font-bold text-gray-500">
                    {driver.rank}
                  </td>
                  {/* Name */}
                  <td className="py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center shrink-0">
                        {driver.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span className="font-bold text-gray-900">
                        {driver.name}
                      </span>
                    </div>
                  </td>
                  {/* Company */}
                  <td className="py-4 text-gray-500">{driver.company}</td>
                  {/* Standing */}
                  <td className="py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold ${
                        driver.standing === "Platinum"
                          ? "bg-slate-100 text-slate-700 border border-slate-200"
                          : "bg-amber-50 text-amber-700 border border-amber-100"
                      }`}
                    >
                      {driver.standing}
                    </span>
                  </td>
                  {/* Score & Growth */}
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-gray-900">
                        {driver.score}
                      </span>
                      <div
                        className={`flex items-center text-[10px] font-bold ${driver.isPositive ? "text-[#008A45]" : "text-[#FF3B30]"}`}
                      >
                        {driver.isPositive ? (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        )}
                        <span>{driver.change}</span>
                      </div>
                    </div>
                  </td>
                  {/* Action button */}
                  <td className="py-4 text-right pr-3">
                    <button
                      onClick={() => handleOpenViewDetails(driver)}
                      className="w-7 h-7 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-600 flex items-center justify-center cursor-pointer transition-colors align-middle"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Pagination row */}
        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-2 mt-6 select-none text-xs">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
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
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-gray-200 rounded-lg font-bold text-[#D13900] hover:bg-red-50/10 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* ----------------- DETAILS MODAL ----------------- */}

      {/* View Driver Details Modal */}
      {isViewModalOpen &&
        selectedDriver &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-9999 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-[480px] p-8 shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in-95 duration-200 text-left">
              {/* Close Button */}
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-full hover:bg-gray-50"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-black text-gray-900 mb-6 border-b border-gray-50 pb-4">
                Driver Details
              </h3>

              <div className="space-y-4 text-xs font-semibold text-gray-800">
                <div>
                  <span className="text-gray-500 font-bold">Name : </span>
                  <span className="text-gray-900 font-extrabold">
                    {selectedDriver.name}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 font-bold">
                    Email Address :{" "}
                  </span>
                  <span className="text-gray-900 font-extrabold">
                    {selectedDriver.email}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 font-bold">
                    Company Name :{" "}
                  </span>
                  <span className="text-gray-900 font-extrabold">
                    {selectedDriver.company}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 font-bold">
                    Overall Standing :{" "}
                  </span>
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      selectedDriver.standing === "Platinum"
                        ? "bg-slate-100 text-slate-700 border border-slate-200"
                        : "bg-amber-50 text-amber-700 border border-amber-100"
                    }`}
                  >
                    {selectedDriver.standing}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 font-bold">
                    Overall Score :{" "}
                  </span>
                  <span className="text-gray-900 font-extrabold">
                    {selectedDriver.score}
                  </span>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
