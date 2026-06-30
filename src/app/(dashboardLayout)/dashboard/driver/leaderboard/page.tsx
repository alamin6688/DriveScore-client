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
} from "lucide-react";
import { createPortal } from "react-dom";
import Link from "next/link";

// Mock data for Safety Drivers Ranks
const SAFETY_DRIVERS = [
  { id: "s1", rank: 1, name: "Daniel Carter", company: "Alpha Fleet", score: 96, change: "+8 From last week", isPositive: true },
  { id: "s2", rank: 2, name: "Daniel Carter", company: "Alpha Fleet", score: 96, change: "+8 From last week", isPositive: true },
  { id: "s3", rank: 3, name: "Daniel Carter", company: "Alpha Fleet", score: 96, change: "+8 From last week", isPositive: true },
  { id: "s4", rank: 4, name: "Daniel Carter", company: "Alpha Fleet", score: 96, change: "+8 From last week", isPositive: true },
  { id: "s5", rank: 5, name: "Daniel Carter", company: "Alpha Fleet", score: 96, change: "+8 From last week", isPositive: true },
  { id: "s6", rank: 6, name: "Daniel Carter", company: "Alpha Fleet", score: 96, change: "+8 From last week", isPositive: true },
  { id: "s7", rank: 7, name: "Daniel Carter", company: "Alpha Fleet", score: 96, change: "+8 From last week", isPositive: true },
];

// Mock data for Quality Drivers Ranks
const QUALITY_DRIVERS = [
  { id: "q1", rank: 1, name: "Daniel Carter", company: "Alpha Fleet", score: 92, change: "+8 From last week", isPositive: true },
  { id: "q2", rank: 2, name: "Daniel Carter", company: "Alpha Fleet", score: 92, change: "+8 From last week", isPositive: true },
  { id: "q3", rank: 3, name: "Daniel Carter", company: "Alpha Fleet", score: 92, change: "+8 From last week", isPositive: true },
  { id: "q4", rank: 4, name: "Daniel Carter", company: "Alpha Fleet", score: 92, change: "+8 From last week", isPositive: true },
  { id: "q5", rank: 5, name: "Daniel Carter", company: "Alpha Fleet", score: 92, change: "+8 From last week", isPositive: true },
  { id: "q6", rank: 6, name: "Daniel Carter", company: "Alpha Fleet", score: 92, change: "+8 From last week", isPositive: true },
  { id: "q7", rank: 7, name: "Daniel Carter", company: "Alpha Fleet", score: 92, change: "+8 From last week", isPositive: true },
];

// Mock data for Current Week Leaderboard Table
const TABLE_DRIVERS = [
  { id: "t1", rank: 1, name: "Daniel Carter", email: "Daniel.Carter@gmail.com", company: "Alpha Fleet", standing: "Platinum", speeding: 96, seatbeltOff: 92, distractions: 92, signalViolations: 92, followingDistance: 92, cdf: 92, dpmo: 92, dsb: 92, pod: 92, packageDelivered: 92, safety: 92, quality: 92, overallScore: 93.8, change: "+8 From last week", isPositive: true },
  { id: "t2", rank: 1, name: "Daniel Carter", email: "Daniel.Carter@gmail.com", company: "Alpha Fleet", standing: "Platinum", speeding: 96, seatbeltOff: 92, distractions: 92, signalViolations: 92, followingDistance: 92, cdf: 92, dpmo: 92, dsb: 92, pod: 92, packageDelivered: 92, safety: 92, quality: 92, overallScore: 93.8, change: "+5 From last week", isPositive: true },
  { id: "t3", rank: 1, name: "Daniel Carter", email: "Daniel.Carter@gmail.com", company: "Alpha Fleet", standing: "Platinum", speeding: 96, seatbeltOff: 92, distractions: 92, signalViolations: 92, followingDistance: 92, cdf: 92, dpmo: 92, dsb: 92, pod: 92, packageDelivered: 92, safety: 92, quality: 92, overallScore: 93.8, change: "+8 From last week", isPositive: true },
  { id: "t4", rank: 1, name: "Daniel Carter", email: "Daniel.Carter@gmail.com", company: "Alpha Fleet", standing: "Platinum", speeding: 96, seatbeltOff: 92, distractions: 92, signalViolations: 92, followingDistance: 92, cdf: 92, dpmo: 92, dsb: 92, pod: 92, packageDelivered: 92, safety: 92, quality: 92, overallScore: 93.8, change: "+8 From last week", isPositive: true },
  { id: "t5", rank: 1, name: "Daniel Carter", email: "Daniel.Carter@gmail.com", company: "Alpha Fleet", standing: "Platinum", speeding: 96, seatbeltOff: 92, distractions: 92, signalViolations: 92, followingDistance: 92, cdf: 92, dpmo: 92, dsb: 92, pod: 92, packageDelivered: 92, safety: 92, quality: 92, overallScore: 93.8, change: "+0 From last week", isPositive: true },
  { id: "t6", rank: 1, name: "Daniel Carter", email: "Daniel.Carter@gmail.com", company: "Alpha Fleet", standing: "Platinum", speeding: 96, seatbeltOff: 92, distractions: 92, signalViolations: 92, followingDistance: 92, cdf: 92, dpmo: 92, dsb: 92, pod: 92, packageDelivered: 92, safety: 92, quality: 92, overallScore: 93.8, change: "+8 From last week", isPositive: true },
  { id: "t7", rank: 1, name: "Daniel Carter", email: "Daniel.Carter@gmail.com", company: "Alpha Fleet", standing: "Platinum", speeding: 96, seatbeltOff: 92, distractions: 92, signalViolations: 92, followingDistance: 92, cdf: 92, dpmo: 92, dsb: 92, pod: 92, packageDelivered: 92, safety: 92, quality: 92, overallScore: 93.8, change: "+5 From last week", isPositive: true },
  { id: "t8", rank: 1, name: "Daniel Carter", email: "Daniel.Carter@gmail.com", company: "Alpha Fleet", standing: "Platinum", speeding: 96, seatbeltOff: 92, distractions: 92, signalViolations: 92, followingDistance: 92, cdf: 92, dpmo: 92, dsb: 92, pod: 92, packageDelivered: 92, safety: 92, quality: 92, overallScore: 93.8, change: "+8 From last week", isPositive: true },
  { id: "t9", rank: 1, name: "Daniel Carter", email: "Daniel.Carter@gmail.com", company: "Alpha Fleet", standing: "Platinum", speeding: 96, seatbeltOff: 92, distractions: 92, signalViolations: 92, followingDistance: 92, cdf: 92, dpmo: 92, dsb: 92, pod: 92, packageDelivered: 92, safety: 92, quality: 92, overallScore: 93.8, change: "+0 From last week", isPositive: true },
];

export default function DriverLeaderboardPage() {
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
  const [selectedDriver, setSelectedDriver] = useState<any>(null);

  // Pagination state for leaderboard table
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
      {/* My Standings Header Bar */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-900">
          My Standings
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

      {/* My Standings Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: My Position */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-start gap-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 rounded-full bg-[#E11D48] flex items-center justify-center text-white shrink-0 shadow-sm">
            <Trophy className="w-6 h-6" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="text-sm font-bold text-gray-900">My Position</span>
              <div className="flex items-center text-[10px] font-bold text-[#008A45] shrink-0">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+8 From last week</span>
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900 mt-2 leading-none">2nd</p>
          </div>
        </div>

        {/* Card 2: Safety Score */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-start gap-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 rounded-full bg-[#008A45] flex items-center justify-center text-white shrink-0 shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="text-sm font-bold text-gray-900">Safety Score</span>
              <div className="flex items-center text-[10px] font-bold text-[#008A45] shrink-0">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+8 From last week</span>
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900 mt-2 leading-none">96</p>
          </div>
        </div>

        {/* Card 3: Quality Score */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-start gap-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 rounded-full bg-[#2F54EB] flex items-center justify-center text-white shrink-0 shadow-sm">
            <Award className="w-6 h-6" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="text-sm font-bold text-gray-900">Quality Score</span>
              <div className="flex items-center text-[10px] font-bold text-[#008A45] shrink-0">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+8 From last week</span>
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900 mt-2 leading-none">92</p>
          </div>
        </div>

        {/* Card 4: Overall Score */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-start gap-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 rounded-full bg-[#FAAD14] flex items-center justify-center text-white shrink-0 shadow-sm">
            <Trophy className="w-6 h-6" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="text-sm font-bold text-gray-900">Overall Score</span>
              <div className="flex items-center text-[10px] font-bold text-[#008A45] shrink-0">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+8 From last week</span>
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900 mt-2 leading-none">93.8</p>
          </div>
        </div>
      </div>

      {/* Top 3 Safety & Quality Drivers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Top 3 Safety Drivers */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between mb-5">
            <div className="text-left">
              <h4 className="text-sm sm:text-base font-bold text-[#008A45]">Top 3 Safety Drivers</h4>
              <p className="text-[11px] text-gray-400 font-semibold mt-0.5">Ranked by safety scores</p>
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
              <div key={driver.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Rank badge */}
                  <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {driver.rank}
                  </div>

                  {/* Avatar initials badge */}
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center shrink-0">
                    {driver.name.split(" ").map(n => n[0]).join("")}
                  </div>

                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-900">{driver.name}</p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{driver.company}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-black text-gray-900 leading-none">{driver.score}</p>
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
              <h4 className="text-sm sm:text-base font-bold text-[#2F54EB]">Top 3 Quality Drivers</h4>
              <p className="text-[11px] text-gray-400 font-semibold mt-0.5">Ranked by Quality scores</p>
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
              <div key={driver.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Rank badge */}
                  <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {driver.rank}
                  </div>

                  {/* Avatar initials badge */}

                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center shrink-0">
                      {driver.name.split(" ").map(n => n[0]).join("")}
                    </div>

                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-900">{driver.name}</p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{driver.company}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-black text-gray-900 leading-none">{driver.score}</p>
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
              <tr className="border-b border-gray-100 text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-wider">
                <th className="pb-4 font-black">Rank</th>
                <th className="pb-4 font-black">Driver Name</th>
                <th className="pb-4 font-black">Company Name</th>
                <th className="pb-4 font-black">Overall Standing</th>
                <th className="pb-4 font-black text-right pr-2">Speeding</th>
                <th className="pb-4 font-black text-right pr-2">Seatbelt Off</th>
                <th className="pb-4 font-black text-right pr-2">Distractions</th>
                <th className="pb-4 font-black text-right pr-2">Signal Violations</th>
                <th className="pb-4 font-black text-right pr-2">Following Distance</th>
                <th className="pb-4 font-black text-right pr-2">(CDF)</th>
                <th className="pb-4 font-black text-right pr-2">(DPMO)</th>
                <th className="pb-4 font-black text-right pr-2">(DSB)</th>
                <th className="pb-4 font-black text-right pr-2">POD</th>
                <th className="pb-4 font-black text-right pr-2">Package Delivered</th>
                <th className="pb-4 font-black text-right pr-2">Safety</th>
                <th className="pb-4 font-black text-right pr-2">Quality</th>
                <th className="pb-4 font-black text-right pr-2">Overall Score</th>
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
                      <span className="font-bold text-blue-600 truncate max-w-[120px] underline  hover:text-blue-700 cursor-pointer">
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
                  {/* Speeding */}
                  <td className="py-4 text-right pr-2 font-black text-gray-900">
                    {driver.speeding}
                  </td>
                  {/* Seatbelt Off */}
                  <td className="py-4 text-right pr-2 font-black text-gray-900">
                    {driver.seatbeltOff}
                  </td>
                  {/* Distractions */}
                  <td className="py-4 text-right pr-2 font-black text-gray-900">
                    {driver.distractions}
                  </td>
                  {/* Signal Violations */}
                  <td className="py-4 text-right pr-2 font-black text-gray-900">
                    {driver.signalViolations}
                  </td>
                  {/* Following Distance */}
                  <td className="py-4 text-right pr-2 font-black text-gray-900">
                    {driver.followingDistance}
                  </td>
                  {/* CDF */}
                  <td className="py-4 text-right pr-2 font-black text-gray-900">
                    {driver.cdf}
                  </td>
                  {/* DPMO */}
                  <td className="py-4 text-right pr-2 font-black text-gray-900">
                    {driver.dpmo}
                  </td>
                  {/* DSB */}
                  <td className="py-4 text-right pr-2 font-black text-gray-900">
                    {driver.dsb}
                  </td>
                  {/* POD */}
                  <td className="py-4 text-right pr-2 font-black text-gray-900">
                    {driver.pod}
                  </td>
                  {/* Package Delivered */}
                  <td className="py-4 text-right pr-2 font-black text-gray-900">
                    {driver.packageDelivered}
                  </td>
                  {/* Safety */}
                  <td className="py-4 text-right pr-2 font-black text-gray-900">
                    {driver.safety}
                  </td>
                  {/* Quality */}
                  <td className="py-4 text-right pr-2 font-black text-gray-900">
                    {driver.quality}
                  </td>
                  {/* Overall Score */}
                  <td className="py-4">
                    <div className="flex items-center justify-end gap-2 pr-2">
                      <span className="font-black text-gray-900">
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
                  {/* Action */}
                  <td className="py-4 text-center">
                    <button
                      onClick={() => handleOpenViewDetails(driver)}
                      className="w-7 h-7 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-600 flex items-center justify-center cursor-pointer transition-colors align-middle mx-auto"
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
              {/* Close Button */}
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

              {/* Scrollable list content */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-4 scrollbar-thin">
                {safetyDrivers.map((driver) => (
                  <div key={driver.id} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-3">
                      {/* Rank badge */}
                      <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {driver.rank}
                      </div>

                      {/* Avatar initials badge */}
                      <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-555 text-xs font-bold flex items-center justify-center shrink-0">
                        {driver.name.split(" ").map(n => n[0]).join("")}
                      </div>

                      <div className="text-left">
                        <p className="text-xs font-bold text-gray-900 leading-none">{driver.name}</p>
                        <p className="text-[10px] text-gray-400 font-semibold mt-1.5">{driver.company}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-black text-gray-900 leading-none">{driver.score}</p>
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
              {/* Close Button */}
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

              {/* Scrollable list content */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-4 scrollbar-thin">
                {qualityDrivers.map((driver) => (
                  <div key={driver.id} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-3">
                      {/* Rank badge */}
                      <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {driver.rank}
                      </div>

                      {/* Avatar initials badge */}
                      <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-555 text-xs font-bold flex items-center justify-center shrink-0">
                        {driver.name.split(" ").map(n => n[0]).join("")}
                      </div>

                      <div className="text-left">
                        <p className="text-xs font-bold text-gray-900 leading-none">{driver.name}</p>
                        <p className="text-[10px] text-gray-400 font-semibold mt-1.5">{driver.company}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-black text-gray-900 leading-none">{driver.score}</p>
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
              {/* Header inside the modal card */}
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

              {/* Box border container around driver fields */}
              <div className="border border-gray-200 rounded-2xl p-6 space-y-4">
                <div className="text-sm">
                  <span className="font-extrabold text-gray-900">Name : </span>
                  <span className="font-semibold text-gray-500">{selectedDriver.name}</span>
                </div>
                <div className="text-sm">
                  <span className="font-extrabold text-gray-900">Email Address : </span>
                  <span className="font-semibold text-gray-500">{selectedDriver.email || "Daniel.Carter@gmail.com"}</span>
                </div>
                <div className="text-sm">
                  <span className="font-extrabold text-gray-900">Company Name : </span>
                  <span className="font-semibold text-gray-500">{selectedDriver.company}</span>
                </div>
                <div className="text-sm">
                  <span className="font-extrabold text-gray-900">Overall Standing : </span>
                  <span className="font-semibold text-gray-500">{selectedDriver.standing}</span>
                </div>
                <div className="text-sm">
                  <span className="font-extrabold text-gray-900">Overall Score : </span>
                  <span className="font-semibold text-gray-500">{selectedDriver.overallScore}</span>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
