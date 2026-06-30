"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  TrendingUp,
  Trophy,
  Flag,
  ChevronDown,
  ShieldAlert,
  Gauge,
  Calendar,
  Wrench,
  Award,
} from "lucide-react";
import {
  useGetProfileDataQuery,
  getProfileName,
} from "@/service/profile/profileApi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CHART_DATA = [
  { name: "W1", score: 78.5 },
  { name: "W2", score: 79 },
  { name: "W3", score: 81 },
  { name: "W4", score: 80 },
  { name: "W5", score: 82 },
  { name: "W6", score: 83.5 },
  { name: "W7", score: 84.5 },
  { name: "W8", score: 85 },
];

export default function DriverDashboardOverview() {
  const [mounted, setMounted] = useState(false);
  const [timeframe, setTimeframe] = useState("last 8 weeks");
  const [timeframeDropdownOpen, setTimeframeDropdownOpen] = useState(false);

  const { data: profileResponse } = useGetProfileDataQuery();
  const user = profileResponse?.data || null;
  const displayName = getProfileName(user) || "John";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Leaderboard data centered around the user (Rank 2)
  const leaders = [
    { rank: 1, name: "Michael Brown", score: 94.8, change: "+8 From last week", isUser: false },
    { rank: 2, name: displayName, score: 92.4, change: "+8 From last week", isUser: true },
    { rank: 3, name: "Michael Brown", score: 90.1, change: "+8 From last week", isUser: false },
    { rank: 4, name: "Michael Brown", score: 88.5, change: "+8 From last week", isUser: false },
  ];

  return (
    <div className="w-full flex flex-col gap-6 font-poppins select-text pb-12 animate-fade-in">
      
      {/* Top 4 KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: My Current Score */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div className="space-y-2 text-left">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">My Current Score</p>
            <p className="text-3xl font-black text-gray-900 leading-tight">92.4</p>
            <div className="flex items-center gap-1 text-[10px] font-bold text-[#008A45]">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+8 From last week</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#D13900] flex items-center justify-center text-white shrink-0 shadow-sm">
            <Shield className="w-6 h-6 stroke-[1.5]" />
          </div>
        </div>

        {/* Card 2: My Rank */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div className="space-y-2 text-left">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">My Rank</p>
            <p className="text-3xl font-black text-gray-900 leading-tight">2/48</p>
            <div className="flex items-center gap-1 text-[10px] font-bold text-[#008A45]">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+8 From last week</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#D13900] flex items-center justify-center text-white shrink-0 shadow-sm">
            <TrendingUp className="w-6 h-6 stroke-[1.5]" />
          </div>
        </div>

        {/* Card 3: Weekly Progress */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div className="space-y-2 text-left">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Weekly Progress</p>
            <p className="text-3xl font-black text-gray-900 leading-tight">4/7</p>
            <p className="text-[10px] font-bold text-gray-400">Not completed yet</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#FAAD14] flex items-center justify-center text-white shrink-0 shadow-sm">
            <Trophy className="w-6 h-6 stroke-[1.5]" />
          </div>
        </div>

        {/* Card 4: Competition */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div className="space-y-2 text-left">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Competition</p>
            <p className="text-3xl font-black text-gray-900 leading-tight">Week 23</p>
            <p className="text-[10px] font-bold text-gray-400">3d 14h left</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#D13900] flex items-center justify-center text-white shrink-0 shadow-sm">
            <Flag className="w-6 h-6 stroke-[1.5]" />
          </div>
        </div>

      </div>

      {/* Main Section: Chart + My Position */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Performance Trend Area Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="text-left">
              <h3 className="text-base font-black text-gray-900">Performance Trend</h3>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">Weekly average score</p>
            </div>
            
            {/* Custom timeframe selection dropdown */}
            <div className="relative">
              <button 
                onClick={() => setTimeframeDropdownOpen(!timeframeDropdownOpen)}
                className="bg-red-50/40 border border-red-100/30 text-[#D13900] hover:bg-red-50/70 font-bold text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1 cursor-pointer transition-colors shadow-sm select-none"
              >
                <span>{timeframe}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#D13900] transition-transform duration-200 ${timeframeDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              
              {timeframeDropdownOpen && (
                <div className="absolute right-0 mt-1.5 bg-white border border-gray-150 rounded-xl shadow-lg py-1.5 z-30 w-32 select-none animate-in fade-in zoom-in-95 duration-100 text-left">
                  {["last 4 weeks", "last 8 weeks", "last 12 weeks"].map((time) => (
                    <button
                      key={time}
                      onClick={() => {
                        setTimeframe(time);
                        setTimeframeDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors ${timeframe === time ? "text-[#D13900] bg-red-50/15" : ""}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="w-full pr-4">
            {mounted ? (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={CHART_DATA} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="1" x2="0" y2="0">
                      <stop offset="5%" stopColor="#D13900" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#D13900" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F5" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: "bold" }}
                  />
                  <YAxis 
                    domain={[70, 90]} 
                    ticks={[70, 75, 80, 85, 90]} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: "bold" }}
                  />
                  <Tooltip 
                    contentStyle={{ background: "#fff", border: "1px solid #F1F3F5", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                    labelStyle={{ fontWeight: "bold", color: "#374151" }}
                    itemStyle={{ color: "#D13900", fontWeight: "bold" }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#D13900" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[260px] w-full bg-gray-50/50 animate-pulse rounded-xl" />
            )}
          </div>
        </div>

        {/* My Position mini-leaderboard */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="text-left mb-4">
            <h3 className="text-base font-black text-gray-900">My Position</h3>
          </div>

          {/* Large centered rank text */}
          <div className="text-center py-2 flex flex-col items-center justify-center">
            <p className="text-4xl font-black text-[#D13900] leading-none">2nd</p>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1.5">Out of 48 Drivers</p>
          </div>

          {/* Mini-leaderboard list */}
          <div className="space-y-1.5 my-4">
            {leaders.map((driver, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
                  driver.isUser 
                    ? "bg-red-50/60 border-red-100/50 text-gray-900" 
                    : "bg-white border-transparent text-gray-700 hover:bg-gray-50/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-4 text-left">{driver.rank}</span>
                  
                  {/* Driver avatar circle with initials */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden ${
                    driver.isUser ? "bg-[#D13900] text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    {driver.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  
                  <span className={`text-xs font-bold ${driver.isUser ? "text-gray-900" : "text-gray-800"}`}>{driver.name}</span>
                </div>
                
                <div className="text-right">
                  <p className="text-xs font-black text-gray-900 leading-none">{driver.score}</p>
                  <p className="text-[9px] font-bold text-[#008A45] mt-1">{driver.change}</p>
                </div>
              </div>
            ))}
          </div>

          {/* View Leaderboard button */}
          <Link 
            href="/dashboard/driver/leaderboard" 
            className="w-full py-3 bg-[#D13900] hover:bg-[#b23000] text-white font-extrabold rounded-2xl text-xs text-center transition-all cursor-pointer shadow-sm hover:shadow"
          >
            View Leaderboard
          </Link>
        </div>

      </div>

      {/* Bottom Section: Improvement Opportunity, Recent Achievements, Score History */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Improvement Opportunity */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="text-left mb-5">
            <h3 className="text-base font-black text-gray-900">Improvement Opportunity</h3>
          </div>

          <div className="space-y-4">
            {/* Speeding */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFEBEB] flex items-center justify-center text-[#FF3B30] shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M12 2a10 10 0 0 1 10 10h-2a8 8 0 0 0-16 0H2A10 10 0 0 1 12 2z" />
                    <path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0" />
                    <path d="M12 10l5-4" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-900 leading-tight">Speeding</p>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Speeding incidents</p>
                </div>
              </div>
              <div className="text-right font-medium text-[10px] text-gray-500 space-y-0.5">
                <p><span className="text-gray-400">Current Score -</span> <span className="text-gray-900 font-black">30</span></p>
                <p><span className="text-gray-400">Team Average -</span> <span className="text-gray-900 font-black">40</span></p>
              </div>
            </div>

            {/* Seatbelt Off */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E6F7F0] flex items-center justify-center text-[#008A45] shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M18 3L6 21" />
                    <rect x="9" y="10" width="6" height="8" rx="1" />
                    <circle cx="12" cy="6" r="3" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-900 leading-tight">Seatbelt Off</p>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Seatbelt off incidents</p>
                </div>
              </div>
              <div className="text-right font-medium text-[10px] text-gray-500 space-y-0.5">
                <p><span className="text-gray-400">Current Score -</span> <span className="text-gray-900 font-black">30</span></p>
                <p><span className="text-gray-400">Team Average -</span> <span className="text-gray-900 font-black">40</span></p>
              </div>
            </div>

            {/* Distractions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFEBEB] flex items-center justify-center text-[#FF3B30] shrink-0">
                  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" stroke="white" strokeWidth="2" />
                    <line x1="12" y1="17" x2="12.01" y2="17" stroke="white" strokeWidth="3" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-900 leading-tight">Distractions</p>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Distracted driving incidents</p>
                </div>
              </div>
              <div className="text-right font-medium text-[10px] text-gray-500 space-y-0.5">
                <p><span className="text-gray-400">Current Score -</span> <span className="text-gray-900 font-black">30</span></p>
                <p><span className="text-gray-400">Team Average -</span> <span className="text-gray-900 font-black">40</span></p>
              </div>
            </div>

            {/* Delivery Completion (DPMO) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E6F7F0] flex items-center justify-center text-[#008A45] shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <circle cx="8" cy="19" r="2" />
                    <circle cx="18" cy="19" r="2" />
                    <path d="M5 6h15l-1.5 9H6.5L4 2H2" />
                    <path d="M9 9h6v3H9z" fill="currentColor" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-900 leading-tight">Delivery Completion (DPMO)</p>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Defects per million opportunities</p>
                </div>
              </div>
              <div className="text-right font-medium text-[10px] text-gray-500 space-y-0.5">
                <p><span className="text-gray-400">Current Score -</span> <span className="text-gray-900 font-black">30</span></p>
                <p><span className="text-gray-400">Team Average -</span> <span className="text-gray-900 font-black">40</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-black text-gray-900">Recent Achievements</h3>
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#FAAD14] flex items-center justify-center text-white shrink-0 shadow-sm">
                    <Trophy className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-900">Top Performer</p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Scored in the top 3 this week</p>
                  </div>
                </div>
                <div className="text-right text-[9px] font-bold text-gray-400 leading-normal">
                  <p>Earned on</p>
                  <p className="text-gray-700">May 27, 2024</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Score History */}
        <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-black text-gray-900">Score History</h3>
            <Link href="/dashboard/driver/performance" className="text-[11px] font-bold text-[#D13900] hover:underline uppercase tracking-wider">
              View all
            </Link>
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#D13900] flex items-center justify-center text-white shrink-0 shadow-sm">
                    <Award className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-900">Week-24 Challenge</p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">248 records - May 19, 2026</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-gray-900">94.8</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
