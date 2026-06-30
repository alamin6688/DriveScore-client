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
  Shield,
  Award,
  ArrowLeft,
  ShieldAlert,
  AlertTriangle,
  Compass,
  MapPin,
  Headphones,
  Truck,
  Image as ImageIcon,
  Package,
  Gauge,
} from "lucide-react";
import { createPortal } from "react-dom";

// Mock datasets for rankings view all popups
const SAFETY_DRIVERS = [
  {
    id: "s1",
    rank: 1,
    name: "Daniel Carter",
    company: "Alpha Fleet",
    score: 96,
    change: "+8 From last week",
    isPositive: true,
  },
  {
    id: "s2",
    rank: 2,
    name: "Daniel Carter",
    company: "Alpha Fleet",
    score: 96,
    change: "+8 From last week",
    isPositive: true,
  },
  {
    id: "s3",
    rank: 3,
    name: "Daniel Carter",
    company: "Alpha Fleet",
    score: 96,
    change: "+8 From last week",
    isPositive: true,
  },
  {
    id: "s4",
    rank: 4,
    name: "Daniel Carter",
    company: "Alpha Fleet",
    score: 96,
    change: "+8 From last week",
    isPositive: true,
  },
  {
    id: "s5",
    rank: 5,
    name: "Daniel Carter",
    company: "Alpha Fleet",
    score: 96,
    change: "+8 From last week",
    isPositive: true,
  },
  {
    id: "s6",
    rank: 6,
    name: "Daniel Carter",
    company: "Alpha Fleet",
    score: 96,
    change: "+8 From last week",
    isPositive: true,
  },
  {
    id: "s7",
    rank: 7,
    name: "Daniel Carter",
    company: "Alpha Fleet",
    score: 96,
    change: "+8 From last week",
    isPositive: true,
  },
];

const QUALITY_DRIVERS = [
  {
    id: "q1",
    rank: 1,
    name: "Daniel Carter",
    company: "Alpha Fleet",
    score: 92,
    change: "+8 From last week",
    isPositive: true,
  },
  {
    id: "q2",
    rank: 2,
    name: "Daniel Carter",
    company: "Alpha Fleet",
    score: 92,
    change: "+8 From last week",
    isPositive: true,
  },
  {
    id: "q3",
    rank: 3,
    name: "Daniel Carter",
    company: "Alpha Fleet",
    score: 92,
    change: "+8 From last week",
    isPositive: true,
  },
  {
    id: "q4",
    rank: 4,
    name: "Daniel Carter",
    company: "Alpha Fleet",
    score: 92,
    change: "+8 From last week",
    isPositive: true,
  },
  {
    id: "q5",
    rank: 5,
    name: "Daniel Carter",
    company: "Alpha Fleet",
    score: 92,
    change: "+8 From last week",
    isPositive: true,
  },
  {
    id: "q6",
    rank: 6,
    name: "Daniel Carter",
    company: "Alpha Fleet",
    score: 92,
    change: "+8 From last week",
    isPositive: true,
  },
  {
    id: "q7",
    rank: 7,
    name: "Daniel Carter",
    company: "Alpha Fleet",
    score: 92,
    change: "+8 From last week",
    isPositive: true,
  },
];

// Mock data for Current Week Leaderboard Table
const TABLE_DRIVERS = [
  {
    id: "t1",
    rank: 1,
    name: "Daniel Carter",
    email: "Daniel.Carter@gmail.com",
    company: "Alpha Fleet",
    standing: "Platinum",
    speeding: 96,
    seatbeltOff: 92,
    distractions: 92,
    signalViolations: 92,
    followingDistance: 92,
    cdf: 92,
    dpmo: 92,
    dsb: 92,
    pod: 92,
    packageDelivered: 92,
    safety: 92,
    quality: 92,
    overallScore: 93.8,
    change: "+8 From last week",
    isPositive: true,
  },
  {
    id: "t2",
    rank: 1,
    name: "Daniel Carter",
    email: "Daniel.Carter@gmail.com",
    company: "Alpha Fleet",
    standing: "Platinum",
    speeding: 96,
    seatbeltOff: 92,
    distractions: 92,
    signalViolations: 92,
    followingDistance: 92,
    cdf: 92,
    dpmo: 92,
    dsb: 92,
    pod: 92,
    packageDelivered: 92,
    safety: 92,
    quality: 92,
    overallScore: 93.8,
    change: "+5 From last week",
    isPositive: true,
  },
  {
    id: "t3",
    rank: 1,
    name: "Daniel Carter",
    email: "Daniel.Carter@gmail.com",
    company: "Alpha Fleet",
    standing: "Platinum",
    speeding: 96,
    seatbeltOff: 92,
    distractions: 92,
    signalViolations: 92,
    followingDistance: 92,
    cdf: 92,
    dpmo: 92,
    dsb: 92,
    pod: 92,
    packageDelivered: 92,
    safety: 92,
    quality: 92,
    overallScore: 93.8,
    change: "+8 From last week",
    isPositive: true,
  },
  {
    id: "t4",
    rank: 1,
    name: "Daniel Carter",
    email: "Daniel.Carter@gmail.com",
    company: "Alpha Fleet",
    standing: "Platinum",
    speeding: 96,
    seatbeltOff: 92,
    distractions: 92,
    signalViolations: 92,
    followingDistance: 92,
    cdf: 92,
    dpmo: 92,
    dsb: 92,
    pod: 92,
    packageDelivered: 92,
    safety: 92,
    quality: 92,
    overallScore: 93.8,
    change: "+8 From last week",
    isPositive: true,
  },
  {
    id: "t5",
    rank: 1,
    name: "Daniel Carter",
    email: "Daniel.Carter@gmail.com",
    company: "Alpha Fleet",
    standing: "Platinum",
    speeding: 96,
    seatbeltOff: 92,
    distractions: 92,
    signalViolations: 92,
    followingDistance: 92,
    cdf: 92,
    dpmo: 92,
    dsb: 92,
    pod: 92,
    packageDelivered: 92,
    safety: 92,
    quality: 92,
    overallScore: 93.8,
    change: "+0 From last week",
    isPositive: true,
  },
  {
    id: "t6",
    rank: 1,
    name: "Daniel Carter",
    email: "Daniel.Carter@gmail.com",
    company: "Alpha Fleet",
    standing: "Platinum",
    speeding: 96,
    seatbeltOff: 92,
    distractions: 92,
    signalViolations: 92,
    followingDistance: 92,
    cdf: 92,
    dpmo: 92,
    dsb: 92,
    pod: 92,
    packageDelivered: 92,
    safety: 92,
    quality: 92,
    overallScore: 93.8,
    change: "+8 From last week",
    isPositive: true,
  },
  {
    id: "t7",
    rank: 1,
    name: "Daniel Carter",
    email: "Daniel.Carter@gmail.com",
    company: "Alpha Fleet",
    standing: "Platinum",
    speeding: 96,
    seatbeltOff: 92,
    distractions: 92,
    signalViolations: 92,
    followingDistance: 92,
    cdf: 92,
    dpmo: 92,
    dsb: 92,
    pod: 92,
    packageDelivered: 92,
    safety: 92,
    quality: 92,
    overallScore: 93.8,
    change: "+5 From last week",
    isPositive: true,
  },
  {
    id: "t8",
    rank: 1,
    name: "Daniel Carter",
    email: "Daniel.Carter@gmail.com",
    company: "Alpha Fleet",
    standing: "Platinum",
    speeding: 96,
    seatbeltOff: 92,
    distractions: 92,
    signalViolations: 92,
    followingDistance: 92,
    cdf: 92,
    dpmo: 92,
    dsb: 92,
    pod: 92,
    packageDelivered: 92,
    safety: 92,
    quality: 92,
    overallScore: 93.8,
    change: "+8 From last week",
    isPositive: true,
  },
  {
    id: "t9",
    rank: 1,
    name: "Daniel Carter",
    email: "Daniel.Carter@gmail.com",
    company: "Alpha Fleet",
    standing: "Platinum",
    speeding: 96,
    seatbeltOff: 92,
    distractions: 92,
    signalViolations: 92,
    followingDistance: 92,
    cdf: 92,
    dpmo: 92,
    dsb: 92,
    pod: 92,
    packageDelivered: 92,
    safety: 92,
    quality: 92,
    overallScore: 93.8,
    change: "+0 From last week",
    isPositive: true,
  },
];

export default function CompanyLeaderboardPage() {
  const [mounted, setMounted] = useState(false);

  // Datasets
  const [safetyDrivers] = useState(SAFETY_DRIVERS);
  const [qualityDrivers] = useState(QUALITY_DRIVERS);
  const [tableDrivers] = useState(TABLE_DRIVERS);

  // Weekly dropdown state
  const [selectedWeek, setSelectedWeek] = useState("Week 23");
  const [weekDropdownOpen, setWeekDropdownOpen] = useState(false);

  // Modal states
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [isQualityModalOpen, setIsQualityModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [selectedDriverForProfile, setSelectedDriverForProfile] =
    useState<any>(null);

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
  const totalPages = Math.ceil(tableDrivers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLeaderboard = tableDrivers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Handle Open View Details
  const handleOpenViewDetails = (driver: any) => {
    setSelectedDriver(driver);
    setIsViewModalOpen(true);
  };

  // Handle Open Profile Details
  const handleOpenProfileModal = (driver: any) => {
    setSelectedDriverForProfile(driver);
    setIsProfileModalOpen(true);
  };

  // Helper to export CSV
  const handleExportCSV = () => {
    const headers = [
      "Rank",
      "Driver Name",
      "Company Name",
      "Overall Standing",
      "Speeding",
      "Seatbelt Off",
      "Distractions",
      "Signal Violations",
      "Following Distance",
      "CDF",
      "DPMO",
      "DSB",
      "POD",
      "Package Delivered",
      "Safety",
      "Quality",
      "Overall Score",
    ];
    const rows = tableDrivers.map((d) => [
      d.rank,
      d.name,
      d.company,
      d.standing,
      d.speeding,
      d.seatbeltOff,
      d.distractions,
      d.signalViolations,
      d.followingDistance,
      d.cdf,
      d.dpmo,
      d.dsb,
      d.pod,
      d.packageDelivered,
      d.safety,
      d.quality,
      d.overallScore,
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
            <div className="absolute right-0 mt-1 bg-white border border-gray-150 rounded-xl shadow-lg py-1 z-30 w-32 select-none animate-in fade-in zoom-in-95 duration-100 text-left">
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

      {/* Top 3 Safety & Quality Drivers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Top 3 Safety Drivers */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between mb-5">
            <div className="text-left">
              <h4 className="text-sm sm:text-base font-bold text-[#008A45]">
                Top 3 Safety Drivers
              </h4>
              <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
                Ranked by safety scores
              </p>
            </div>
            <button
              onClick={() => setIsSafetyModalOpen(true)}
              className="text-xs font-bold text-[#D13900] hover:underline cursor-pointer select-none"
            >
              View all
            </button>
          </div>

          <div className="space-y-4">
            {safetyDrivers.slice(0, 3).map((driver) => (
              <div
                key={driver.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {driver.rank}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center shrink-0">
                    {driver.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-900">
                      {driver.name}
                    </p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                      {driver.company}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-gray-900 leading-none">
                    {driver.score}
                  </p>
                  <div className="flex items-center justify-end text-[9px] font-bold text-[#008A45] mt-1">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>{driver.change}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Top 3 Quality Drivers */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between mb-5">
            <div className="text-left">
              <h4 className="text-sm sm:text-base font-bold text-[#2F54EB]">
                Top 3 Quality Drivers
              </h4>
              <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
                Ranked by Quality scores
              </p>
            </div>
            <button
              onClick={() => setIsQualityModalOpen(true)}
              className="text-xs font-bold text-[#D13900] hover:underline cursor-pointer select-none"
            >
              View all
            </button>
          </div>

          <div className="space-y-4">
            {qualityDrivers.slice(0, 3).map((driver) => (
              <div
                key={driver.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {driver.rank}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center shrink-0">
                    {driver.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-900">
                      {driver.name}
                    </p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                      {driver.company}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-gray-900 leading-none">
                    {driver.score}
                  </p>
                  <div className="flex items-center justify-end text-[9px] font-bold text-[#008A45] mt-1">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>{driver.change}</span>
                  </div>
                </div>
              </div>
            ))}
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
          <table className="w-full text-left border-collapse min-w-[1800px]">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] sm:text-xs font-black text-black/80  tracking-wider">
                <th className="pb-4 font-black text-center pr-2">Rank</th>
                <th className="pb-4 font-black text-center pr-2">Driver Name</th>
                <th className="pb-4 font-black text-center pr-2">Company Name</th>
                <th className="pb-4 font-black text-center pr-2">Overall Standing</th>
                <th className="pb-4 font-black text-center pr-2">Speeding</th>
                <th className="pb-4 font-black text-center pr-2">
                  Seatbelt Off
                </th>
                <th className="pb-4 font-black text-center pr-2">
                  Distractions
                </th>
                <th className="pb-4 font-black text-center pr-2">
                  Signal Violations
                </th>
                <th className="pb-4 font-black text-center pr-2">
                  Following Distance
                </th>
                <th className="pb-4 font-black text-center pr-2">(CDF)</th>
                <th className="pb-4 font-black text-center pr-2">(DPMO)</th>
                <th className="pb-4 font-black text-center pr-2">(DSB)</th>
                <th className="pb-4 font-black text-center pr-2">POD</th>
                <th className="pb-4 font-black text-center pr-2">
                  Package Delivered
                </th>
                <th className="pb-4 font-black text-center pr-2">Safety</th>
                <th className="pb-4 font-black text-center pr-2">Quality</th>
                <th className="pb-4 font-black text-center pr-2">
                  Overall Score
                </th>
                <th className="pb-4 text-center font-black">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">
              {paginatedLeaderboard.map((driver) => (
                <tr
                  key={driver.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {/* Rank */}
                  <td className="py-4 font-bold text-gray-550 text-center">
                    {driver.rank}
                  </td>
                  {/* Name */}
                  <td className="py-4 text-center">
                    <div className="flex items-center gap-2.5 justify-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center shrink-0">
                        {driver.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span
                        onClick={() => handleOpenProfileModal(driver)}
                        className="font-bold text-blue-600 truncate max-w-[120px] underline hover:text-blue-700 cursor-pointer"
                      >
                        {driver.name}
                      </span>
                    </div>
                  </td>
                  {/* Company */}
                  <td className="py-4 text-gray-555 text-center">{driver.company}</td>
                  {/* Standing */}
                  <td className="py-4 text-center">
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
                  {/* Speeding */}
                  <td className="py-4 text-center pr-2 font-black text-gray-700">
                    {driver.speeding}
                  </td>
                  {/* Seatbelt Off */}
                  <td className="py-4 text-center pr-2 font-black text-gray-700">
                    {driver.seatbeltOff}
                  </td>
                  {/* Distractions */}
                  <td className="py-4 text-center pr-2 font-black text-gray-700">
                    {driver.distractions}
                  </td>
                  {/* Signal Violations */}
                  <td className="py-4 text-center pr-2 font-black text-gray-700">
                    {driver.signalViolations}
                  </td>
                  {/* Following Distance */}
                  <td className="py-4 text-center pr-2 font-black text-gray-700">
                    {driver.followingDistance}
                  </td>
                  {/* CDF */}
                  <td className="py-4 text-center pr-2 font-black text-gray-700">
                    {driver.cdf}
                  </td>
                  {/* DPMO */}
                  <td className="py-4 text-center pr-2 font-black text-gray-700">
                    {driver.dpmo}
                  </td>
                  {/* DSB */}
                  <td className="py-4 text-center pr-2 font-black text-gray-700">
                    {driver.dsb}
                  </td>
                  {/* POD */}
                  <td className="py-4 text-center pr-2 font-black text-gray-700">
                    {driver.pod}
                  </td>
                  {/* Package Delivered */}
                  <td className="py-4 text-center pr-2 font-black text-gray-700">
                    {driver.packageDelivered}
                  </td>
                  {/* Safety */}
                  <td className="py-4 text-center pr-2 font-black text-gray-700">
                    {driver.safety}
                  </td>
                  {/* Quality */}
                  <td className="py-4 text-center pr-2 font-black text-gray-700">
                    {driver.quality}
                  </td>
                  {/* Overall Score */}
                  <td className="py-4 text-center">
                    <div className="flex items-center justify-center gap-2 pr-2">
                      <span className="font-black text-gray-700">
                        {driver.overallScore}
                      </span>
                      <div
                        className={`flex items-center text-[10px] font-bold shrink-0 ${driver.isPositive ? "text-[#008A45]" : "text-[#FF3B30]"}`}
                      >
                        {driver.isPositive ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        <span>{driver.change}</span>
                      </div>
                    </div>
                  </td>
                  {/* Action button */}
                  <td className="py-4 text-center">
                    <button
                      onClick={() => handleOpenViewDetails(driver)}
                      className="w-7 h-7 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-700 hover:text-gray-655 flex items-center justify-center cursor-pointer transition-colors align-middle mx-auto"
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
              className="px-3 py-1.5 border border-gray-200 rounded-lg font-bold text-gray-505 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
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
                      : "border border-gray-200 text-gray-505 hover:bg-gray-50"
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

      {/* ----------------- SAFETY DRIVERS MODAL ----------------- */}
      {isSafetyModalOpen &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-9999 flex items-center justify-center p-4"
            onClick={() => setIsSafetyModalOpen(false)}
          >
            <div
              className="bg-white rounded-3xl w-full max-w-[480px] p-8 shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in-95 duration-200 text-left max-h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsSafetyModalOpen(false)}
                className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-full hover:bg-gray-50"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6 border-b border-gray-50 pb-4 shrink-0">
                <h3 className="text-xl font-black text-[#008A45] leading-tight">
                  Safety Drivers List
                </h3>
                <p className="text-xs text-gray-400 font-semibold mt-1">
                  Ranked by safety scores
                </p>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 space-y-4 scrollbar-thin">
                {safetyDrivers.map((driver) => (
                  <div
                    key={driver.id}
                    className="flex items-center justify-between py-1"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {driver.rank}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-200 text-xs font-bold flex items-center justify-center shrink-0">
                        {driver.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-gray-900 leading-none">
                          {driver.name}
                        </p>
                        <p className="text-[10px] text-gray-400 font-semibold mt-1.5">
                          {driver.company}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-gray-900 leading-none">
                        {driver.score}
                      </p>
                      <div className="flex items-center justify-end text-[9px] font-bold text-[#008A45] mt-1">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>{driver.change}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* ----------------- QUALITY DRIVERS MODAL ----------------- */}
      {isQualityModalOpen &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-9999 flex items-center justify-center p-4"
            onClick={() => setIsQualityModalOpen(false)}
          >
            <div
              className="bg-white rounded-3xl w-full max-w-[480px] p-8 shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in-95 duration-200 text-left max-h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsQualityModalOpen(false)}
                className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-full hover:bg-gray-50"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6 border-b border-gray-50 pb-4 shrink-0">
                <h3 className="text-xl font-black text-[#2F54EB] leading-tight">
                  Quality Drivers List
                </h3>
                <p className="text-xs text-gray-400 font-semibold mt-1">
                  Ranked by safety scores
                </p>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 space-y-4 scrollbar-thin">
                {qualityDrivers.map((driver) => (
                  <div
                    key={driver.id}
                    className="flex items-center justify-between py-1"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {driver.rank}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-200 text-xs font-bold flex items-center justify-center shrink-0">
                        {driver.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-gray-900 leading-none">
                          {driver.name}
                        </p>
                        <p className="text-[10px] text-gray-400 font-semibold mt-1.5">
                          {driver.company}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-gray-900 leading-none">
                        {driver.score}
                      </p>
                      <div className="flex items-center justify-end text-[9px] font-bold text-[#008A45] mt-1">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>{driver.change}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* ----------------- DETAILS MODAL ----------------- */}
      {isViewModalOpen &&
        selectedDriver &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-9999 flex items-center justify-center p-4"
            onClick={() => setIsViewModalOpen(false)}
          >
            <div
              className="bg-white rounded-3xl w-full max-w-[480px] p-8 shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in-95 duration-200 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5 pb-3.5 border-b border-gray-100">
                <h3 className="text-lg font-black text-gray-900 leading-tight">
                  Driver Details
                </h3>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-red-50 text-[#FF3B30] hover:bg-red-100/70 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="border border-gray-200 rounded-2xl p-6 space-y-4">
                <div className="text-sm">
                  <span className="font-extrabold text-gray-900">Name : </span>
                  <span className="font-semibold text-gray-500">
                    {selectedDriver.name}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-extrabold text-gray-900">
                    Company Name :{" "}
                  </span>
                  <span className="font-semibold text-gray-500">
                    {selectedDriver.company}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-extrabold text-gray-900">
                    Overall Standing :{" "}
                  </span>
                  <span className="font-semibold text-gray-500">
                    {selectedDriver.standing}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-extrabold text-gray-900">
                    Safety Score:{" "}
                  </span>
                  <span className="font-semibold text-gray-500">
                    {selectedDriver.safety || 96}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-extrabold text-gray-900">
                    Quality Score:{" "}
                  </span>
                  <span className="font-semibold text-gray-500">
                    {selectedDriver.quality || 92}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-extrabold text-gray-900">
                    Overall Score :{" "}
                  </span>
                  <span className="font-semibold text-gray-500">
                    {selectedDriver.overallScore}
                  </span>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* ----------------- DRIVER PROFILE MODAL (LARGE SCREEN) ----------------- */}
      {isProfileModalOpen &&
        selectedDriverForProfile &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-9998 flex items-center justify-center p-4"
            onClick={() => setIsProfileModalOpen(false)}
          >
            <div
              className="bg-white rounded-3xl w-full max-w-[880px] p-8 shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in-95 duration-200 text-left max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Back Button */}
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="flex items-center gap-1.5 text-xs font-bold text-[#FF3B30] mb-4 hover:underline cursor-pointer select-none"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Leaderboard</span>
              </button>

              <div className="mb-6 flex items-start justify-between border-b border-gray-50 pb-5">
                <div className="text-left">
                  <h3 className="text-xl font-black text-gray-900 leading-tight">
                    Driver Profile
                  </h3>
                  <p className="text-xs text-gray-400 font-semibold mt-1">
                    Track driver performance and scores
                  </p>
                </div>
              </div>

              {/* Driver Card Info Box */}
              <div className="border border-gray-150 rounded-2xl p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-600 text-sm font-bold flex items-center justify-center shrink-0">
                      {selectedDriverForProfile.name
                        .split(" ")
                        .map((n: any) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-base font-bold text-gray-900 leading-tight">
                        {selectedDriverForProfile.name}
                      </p>
                      <p className="text-xs text-gray-400 font-semibold mt-0.5">
                        {selectedDriverForProfile.company}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-50 text-green-600 font-bold text-[10px] rounded-full self-start sm:self-center border border-green-100">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100 text-xs font-semibold text-gray-800">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                      Associate ID
                    </p>
                    <p className="text-gray-900 font-extrabold">DRV-1024</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                      Email Address
                    </p>
                    <p className="text-gray-900 font-extrabold">
                      {selectedDriverForProfile.email ||
                        "Daniel.Carter@gmail.com"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                      Phone Number
                    </p>
                    <p className="text-gray-900 font-extrabold">
                      (555) 123-4567
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                      Join Date
                    </p>
                    <p className="text-gray-900 font-extrabold">Jan 15, 2026</p>
                  </div>
                </div>
              </div>

              {/* KPI Standings Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#E11D48] flex items-center justify-center text-white shrink-0">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Position
                    </p>
                    <p className="text-lg font-black text-gray-900 mt-1">2nd</p>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#008A45] flex items-center justify-center text-white shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Safety Score
                    </p>
                    <p className="text-lg font-black text-gray-900 mt-1">
                      {selectedDriverForProfile.safety || 96}
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#2F54EB] flex items-center justify-center text-white shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Quality Score
                    </p>
                    <p className="text-lg font-black text-gray-900 mt-1">
                      {selectedDriverForProfile.quality || 92}
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#FAAD14] flex items-center justify-center text-white shrink-0">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Overall Score
                    </p>
                    <p className="text-lg font-black text-gray-900 mt-1">
                      {selectedDriverForProfile.overallScore}
                    </p>
                  </div>
                </div>
              </div>

              {/* Breakdowns Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Safety Score Breakdown */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-sm font-bold text-gray-900">
                      Safety Score
                    </h4>
                    <span className="text-base font-black text-red-600">
                      96
                    </span>
                  </div>
                  <p className="text-[9px] text-gray-400 font-semibold mb-4">
                    Total weight: 70% of Overall Score
                  </p>

                  <div className="space-y-3">
                    {[
                      {
                        name: "Speeding",
                        desc: "Speeding incidents",
                        score: 92,
                        change: "+8 From last week",
                        icon: <Gauge className="w-4 h-4" />,
                        bg: "bg-red-50 text-red-500",
                      },
                      {
                        name: "Seatbelt Off",
                        desc: "Seatbelt off incidents",
                        score: 92,
                        change: "+8 From last week",
                        icon: <ShieldAlert className="w-4 h-4" />,
                        bg: "bg-green-50 text-green-600",
                      },
                      {
                        name: "Distractions",
                        desc: "Distracted driving incidents",
                        score: 92,
                        change: "+8 From last week",
                        icon: <AlertTriangle className="w-4 h-4" />,
                        bg: "bg-red-50 text-red-500",
                      },
                      {
                        name: "Sign/Signal Violations",
                        desc: "Turn signal & sign violations",
                        score: 92,
                        change: "+8 From last week",
                        icon: <Compass className="w-4 h-4" />,
                        bg: "bg-amber-50 text-amber-500",
                      },
                      {
                        name: "Following Distance",
                        desc: "Following distance incidents",
                        score: 92,
                        change: "+8 From last week",
                        icon: <MapPin className="w-4 h-4" />,
                        bg: "bg-purple-50 text-purple-500",
                      },
                    ].map((metric, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs hover:bg-gray-50/50 p-1.5 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${metric.bg}`}
                          >
                            {metric.icon}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              {metric.name}
                            </p>
                            <p className="text-[8px] text-gray-400 font-medium mt-0.5">
                              {metric.desc}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-4">
                          <span className="font-black text-gray-700">
                            {metric.score}
                          </span>
                          <span className="text-[9px] font-bold text-[#008A45] flex items-center gap-0.5 shrink-0">
                            <ArrowUpRight className="w-3 h-3" />
                            {metric.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quality Score Breakdown */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-sm font-bold text-gray-900">
                      Quality Score
                    </h4>
                    <span className="text-base font-black text-red-600">
                      92
                    </span>
                  </div>
                  <p className="text-[9px] text-gray-400 font-semibold mb-4">
                    Total weight: 30% of Overall Score
                  </p>

                  <div className="space-y-3">
                    {[
                      {
                        name: "Customer Feedback (CDF)",
                        desc: "Customer satisfaction rating",
                        score: 92,
                        change: "+8 From last week",
                        icon: <Headphones className="w-4 h-4" />,
                        bg: "bg-red-50 text-red-500",
                      },
                      {
                        name: "Delivery Completion (DPMO)",
                        desc: "Defects per million opportunities",
                        score: 92,
                        change: "+8 From last week",
                        icon: <Truck className="w-4 h-4" />,
                        bg: "bg-green-50 text-green-600",
                      },
                      {
                        name: "Delivery Success Behavior (DSB)",
                        desc: "Delivery success behavior score",
                        score: 92,
                        change: "+8 From last week",
                        icon: <Sparkles className="w-4 h-4" />,
                        bg: "bg-red-50 text-red-500",
                      },
                      {
                        name: "POD Photos",
                        desc: "Proof of delivery photos",
                        score: 92,
                        change: "+8 From last week",
                        icon: <ImageIcon className="w-4 h-4" />,
                        bg: "bg-amber-50 text-amber-500",
                      },
                      {
                        name: "Package Delivered",
                        desc: "Packages",
                        score: 92,
                        change: "+8 From last week",
                        icon: <Package className="w-4 h-4" />,
                        bg: "bg-purple-50 text-purple-500",
                      },
                    ].map((metric, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs hover:bg-gray-50/50 p-1.5 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${metric.bg}`}
                          >
                            {metric.icon}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              {metric.name}
                            </p>
                            <p className="text-[8px] text-gray-400 font-medium mt-0.5">
                              {metric.desc}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-4">
                          <span className="font-black text-gray-700">
                            {metric.score}
                          </span>
                          <span className="text-[9px] font-bold text-[#008A45] flex items-center gap-0.5 shrink-0">
                            <ArrowUpRight className="w-3 h-3" />
                            {metric.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
