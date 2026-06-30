"use client";
 
import React, { useState, useEffect } from "react";
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Trophy, 
  Target, 
  ChevronDown, 
  ArrowUpRight, 
  ArrowDownRight 
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import Link from "next/link";
 
// Mock data for weekly average scores trend chart
const weeklyTrendData = [
  { week: "W1", score: 80.2 },
  { week: "W2", score: 81.5 },
  { week: "W3", score: 83.4 },
  { week: "W4", score: 82.2 },
  { week: "W5", score: 86.1 },
  { week: "W6", score: 87.3 },
  { week: "W7", score: 88.0 },
  { week: "W8", score: 88.5 },
];
 
// Top performer drivers list mock data
const topPerformers = [
  { rank: 1, name: "Daniel Carter", fleet: "Alpha Fleet", score: 97.3, change: "+8 From last week" },
  { rank: 2, name: "Daniel Carter", fleet: "Alpha Fleet", score: 97.3, change: "+8 From last week" },
  { rank: 3, name: "Daniel Carter", fleet: "Alpha Fleet", score: 97.3, change: "+8 From last week" },
  { rank: 4, name: "Daniel Carter", fleet: "Alpha Fleet", score: 97.3, change: "+8 From last week" },
  { rank: 5, name: "Daniel Carter", fleet: "Alpha Fleet", score: 97.3, change: "+8 From last week" },
];
 
// Less performer drivers list mock data
const lessPerformers = [
  { rank: 1, name: "Daniel Carter", fleet: "Alpha Fleet", score: 64.4, change: "-8 From last week" },
  { rank: 2, name: "Daniel Carter", fleet: "Alpha Fleet", score: 64.4, change: "-8 From last week" },
  { rank: 3, name: "Daniel Carter", fleet: "Alpha Fleet", score: 64.4, change: "-8 From last week" },
  { rank: 4, name: "Daniel Carter", fleet: "Alpha Fleet", score: 64.4, change: "-8 From last week" },
  { rank: 5, name: "Daniel Carter", fleet: "Alpha Fleet", score: 64.4, change: "-8 From last week" },
];
 
// Custom tooltip component for Recharts
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 border border-gray-100 rounded-xl shadow-lg text-xs font-bold text-gray-800">
        <p className="text-gray-400 font-semibold mb-0.5">{payload[0].payload.week}</p>
        <p className="text-[#D13900]">Score: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};
 
export default function CompanyDashboardOverview() {
  const [mounted, setMounted] = useState(false);
  const [timeframe, setTimeframe] = useState("last 8 weeks");
  const [dropdownOpen, setDropdownOpen] = useState(false);
 
  useEffect(() => {
    setMounted(true);
  }, []);
 
  if (!mounted) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center text-gray-400 font-medium">
        Loading Overview...
      </div>
    );
  }
 
  return (
    <div className="w-full space-y-6 font-poppins pb-12 select-text animate-fade-in">
      
      {/* Overview Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Total Drivers Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Drivers</p>
            <p className="text-3xl font-black text-gray-900 leading-none">248</p>
            <p className="text-xs text-gray-400 font-semibold pt-1">This week</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#D13900] flex items-center justify-center text-white shadow-sm shrink-0">
            <Users className="w-5.5 h-5.5" />
          </div>
        </div>
 
        {/* Average Score Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Average Score</p>
            <p className="text-3xl font-black text-gray-900 leading-none">84.6</p>
            <div className="flex items-center gap-1 text-[11px] text-[#008A45] font-bold pt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+8 From last week</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#D13900] flex items-center justify-center text-white shadow-sm shrink-0">
            <TrendingUp className="w-5.5 h-5.5" />
          </div>
        </div>
 
        {/* Top Performer Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Top Performer</p>
            <p className="text-3xl font-black text-gray-900 leading-none">97.3</p>
            <p className="text-xs text-gray-400 font-semibold pt-1 truncate max-w-[150px]">Daniel Carter</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#FAAD14] flex items-center justify-center text-white shadow-sm shrink-0">
            <Trophy className="w-5.5 h-5.5" />
          </div>
        </div>
 
        {/* Competition Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Competition</p>
            <p className="text-3xl font-black text-gray-900 leading-none">Week 23</p>
            <p className="text-xs text-gray-400 font-semibold pt-1">This Week</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#D13900] flex items-center justify-center text-white shadow-sm shrink-0">
            <Target className="w-5.5 h-5.5" />
          </div>
        </div>
 
      </div>
 
      {/* Drivers Performance Trend Chart Card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        
        {/* Chart Header */}
        <div className="flex items-center justify-between mb-6 relative">
          <div>
            <h3 className="text-base font-bold text-gray-900">Driver&apos;s Performance Trend</h3>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">Weekly average score</p>
          </div>
          
          {/* Custom Capsule Dropdown Selector */}
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-[#E2F5EA] text-[#008A45] hover:bg-[#d0f0dd] font-bold text-xs px-4 py-1.5 rounded-full flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>{timeframe}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-1 bg-white border border-gray-150 rounded-xl shadow-lg py-1 z-30 w-36 select-none animate-in fade-in zoom-in-95 duration-100">
                {["last 4 weeks", "last 8 weeks", "last 12 weeks"].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setTimeframe(item);
                      setDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors ${timeframe === item ? "text-[#008A45] bg-[#E2F5EA]/35" : ""}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
 
        {/* Performance Trend Chart */}
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D13900" stopOpacity={0.0}/>
                  <stop offset="95%" stopColor="#D13900" stopOpacity={0.35}/>
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#F3F4F6" strokeDasharray="3 3" />
              <XAxis 
                dataKey="week" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 600 }}
              />
              <YAxis 
                domain={[70, 90]} 
                ticks={[70, 75, 80, 85, 90]}
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 600 }}
              />
              <Tooltip content={<CustomTooltip />} />
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
        </div>
 
      </div>
 
      {/* Top Performers and Less Performers Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Performers Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm sm:text-base font-bold text-[#008A45]">Top Performers</h4>
            <Link href="/dashboard/company/leaderboard">
            <button className="text-xs font-bold text-[#D13900] hover:underline cursor-pointer">View all</button>
            </Link>
          </div>
          
          <div className="divide-y divide-gray-50">
            {topPerformers.map((driver, idx) => (
              <div key={idx} className="flex items-center justify-between py-3.5 hover:bg-gray-50/50 px-2 rounded-xl transition-all duration-200">
                <div className="flex items-center gap-3">
                  {/* Rank Badge */}
                  <div className="w-6 h-6 rounded-full bg-[#EEF2F6] text-[#64748B] text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  {/* Initials Avatar */}
                  <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center shrink-0">
                    {driver.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  {/* Driver Name & Fleet */}
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-900 leading-tight">{driver.name}</p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{driver.fleet}</p>
                  </div>
                </div>
 
                {/* Score & Weekly Growth Change */}
                <div className="text-right">
                  <p className="text-xs sm:text-sm font-black text-gray-900 leading-tight">{driver.score}</p>
                  <div className="flex items-center justify-end gap-0.5 text-[9px] sm:text-[10px] text-[#008A45] font-bold mt-0.5">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>{driver.change}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
 
        {/* Less Performers Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm sm:text-base font-bold text-[#D13900]">Less Performers</h4>
            <Link href="/dashboard/company/leaderboard">
            <button className="text-xs font-bold text-[#D13900] hover:underline cursor-pointer">View all</button>
            </Link>
          </div>
 
          <div className="divide-y divide-gray-50">
            {lessPerformers.map((driver, idx) => (
              <div key={idx} className="flex items-center justify-between py-3.5 hover:bg-gray-50/50 px-2 rounded-xl transition-all duration-200">
                <div className="flex items-center gap-3">
                  {/* Rank Badge */}
                  <div className="w-6 h-6 rounded-full bg-[#EEF2F6] text-[#64748B] text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  {/* Initials Avatar */}
                  <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center shrink-0">
                    {driver.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  {/* Driver Name & Fleet */}
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-900 leading-tight">{driver.name}</p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{driver.fleet}</p>
                  </div>
                </div>
 
                {/* Score & Weekly Decay Change */}
                <div className="text-right">
                  <p className="text-xs sm:text-sm font-black text-gray-900 leading-tight">{driver.score}</p>
                  <div className="flex items-center justify-end gap-0.5 text-[9px] sm:text-[10px] text-[#FF3B30] font-bold mt-0.5">
                    <ArrowDownRight className="w-3 h-3" />
                    <span>{driver.change}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
 
      </div>
      
    </div>
  );
}
