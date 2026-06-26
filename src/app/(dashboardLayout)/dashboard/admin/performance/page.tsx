"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Building,
  Swords,
  Activity,
  ChevronDown,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RankingItem {
  rank: number;
  initials: string;
  name: string;
  type: string;
  score: number;
  trend: string;
}

interface CompanyRankingRow {
  rank: number;
  name: string;
  drivers: number;
  location: string;
  score: number;
  trend: string;
}

const KPI_CARDS = [
  {
    id: "drivers",
    title: "Total Drivers",
    value: "248",
    icon: <Users className="w-5.5 h-5.5 stroke-[1.5]" />,
    iconBg: "bg-[#D13900]",
    iconColor: "text-white",
  },
  {
    id: "average",
    title: "Platform Average Score",
    value: "84.2",
    icon: <Building className="w-5.5 h-5.5 stroke-[1.5]" />,
    iconBg: "bg-[#FFEBEB]",
    iconColor: "text-[#D13900]",
  },
  {
    id: "competitions",
    title: "Active Competitions",
    value: "110",
    icon: <Swords className="w-5.5 h-5.5 stroke-[1.5]" />,
    iconBg: "bg-[#D13900]",
    iconColor: "text-white",
  },
  {
    id: "participation",
    title: "Participation Rate",
    value: "87%",
    icon: <Activity className="w-5.5 h-5.5 stroke-[1.5]" />,
    iconBg: "bg-[#258200]",
    iconColor: "text-white",
  },
];

const CHART_DATA = [
  { name: "W1", score: 78.5 },
  { name: "W2", score: 79.8 },
  { name: "W3", score: 81.2 },
  { name: "W4", score: 80.7 },
  { name: "W5", score: 83.1 },
  { name: "W6", score: 83.6 },
  { name: "W7", score: 84.4 },
  { name: "W8", score: 84.9 },
];

const TOP_RANKINGS: RankingItem[] = [
  { rank: 1, initials: "DC", name: "Alpha Fleet", type: "Company", score: 97.3, trend: "+8 From last week" },
  { rank: 2, initials: "DC", name: "Alpha Fleet", type: "Company", score: 97.3, trend: "+8 From last week" },
  { rank: 3, initials: "DC", name: "Alpha Fleet", type: "Company", score: 97.3, trend: "+8 From last week" },
  { rank: 4, initials: "DC", name: "Alpha Fleet", type: "Company", score: 97.3, trend: "+8 From last week" },
  { rank: 5, initials: "DC", name: "Alpha Fleet", type: "Company", score: 97.3, trend: "+8 From last week" },
  { rank: 6, initials: "DC", name: "Alpha Fleet", type: "Company", score: 97.3, trend: "+8 From last week" },
];

const TABLE_ROWS: CompanyRankingRow[] = [
  { rank: 1, name: "Alpha Fleet", drivers: 456, location: "USA", score: 93.8, trend: "+8 From last week" },
  { rank: 2, name: "Alpha Fleet", drivers: 456, location: "USA", score: 93.8, trend: "+8 From last week" },
  { rank: 3, name: "Alpha Fleet", drivers: 456, location: "USA", score: 93.8, trend: "+8 From last week" },
  { rank: 4, name: "Alpha Fleet", drivers: 456, location: "USA", score: 93.8, trend: "+8 From last week" },
  { rank: 5, name: "Alpha Fleet", drivers: 456, location: "USA", score: 93.8, trend: "+8 From last week" },
  { rank: 6, name: "Alpha Fleet", drivers: 456, location: "USA", score: 93.8, trend: "+8 From last week" },
  { rank: 7, name: "Alpha Fleet", drivers: 456, location: "USA", score: 93.8, trend: "+8 From last week" },
];

export default function AdminPerformanceOverview() {
  const [mounted, setMounted] = useState(false);
  const [timeframe, setTimeframe] = useState("last 8 weeks");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center text-gray-400 font-medium font-poppins">
        Loading Performance...
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 font-poppins select-text pb-12 animate-fade-in text-left">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {KPI_CARDS.map((card) => (
          <div
            key={card.id}
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between transition-all hover:shadow-md"
          >
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {card.title}
              </p>
              <p className="text-3xl font-black text-gray-900 leading-none">
                {card.value}
              </p>
            </div>
            <div
              className={`w-12 h-12 rounded-full ${card.iconBg} ${card.iconColor} flex items-center justify-center shrink-0 shadow-sm`}
            >
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main Sections: Chart + Top Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Trend Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <h3 className="text-base font-black text-gray-900">Platform Performance Trend</h3>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">Weekly average score</p>
            </div>

            {/* Timeframe Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="bg-[#EAFBEE] border border-gray-100 text-[#52C41A] hover:bg-[#d8f7e0] font-bold text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1 cursor-pointer transition-colors shadow-sm select-none"
              >
                <span>{timeframe}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#52C41A] transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-1.5 bg-white border border-gray-150 rounded-xl shadow-lg py-1.5 z-30 w-36 select-none animate-in fade-in zoom-in-95 duration-100 text-left">
                  {["last 4 weeks", "last 8 weeks", "last 12 weeks"].map((time) => (
                    <button
                      key={time}
                      onClick={() => {
                        setTimeframe(time);
                        setDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors ${timeframe === time ? "text-[#52C41A] bg-[#EAFBEE]/50" : ""}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recharts Area Chart */}
          <div className="w-full pr-4 mt-2">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={CHART_DATA} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPlatformScore" x1="0" y1="1" x2="0" y2="0">
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
                  contentStyle={{
                    background: "#white",
                    border: "1px solid #F1F3F5",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                  labelStyle={{ fontWeight: "bold", color: "#374151" }}
                  itemStyle={{ color: "#D13900", fontWeight: "bold" }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#D13900"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorPlatformScore)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Company Rankings List */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
          <h3 className="text-base font-black text-gray-900 text-left">Top Company Rankings</h3>
          
          <div className="space-y-4 max-h-[310px] overflow-y-auto pr-1 scrollbar-hide">
            {TOP_RANKINGS.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-3">
                  {/* Rank Badge */}
                  <div className="w-6 h-6 rounded-full bg-[#FFEBEB] text-[#D13900] text-[10px] font-bold flex items-center justify-center shrink-0">
                    {item.rank}
                  </div>
                  
                  {/* Initials Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400 text-xs shrink-0">
                    {item.initials}
                  </div>
                  
                  {/* Company Details */}
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-gray-950 truncate max-w-[110px]">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                      {item.type}
                    </p>
                  </div>
                </div>

                {/* Score and Trend metrics */}
                <div className="text-right">
                  <p className="text-xs font-black text-gray-950">
                    {item.score}
                  </p>
                  <div className="flex items-center gap-0.5 text-[9px] font-bold text-[#008A45] mt-0.5">
                    <TrendingUp className="w-2.5 h-2.5" />
                    <span>{item.trend}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Company Rankings Table Container */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col gap-5">
        <h3 className="text-base font-black text-gray-900 px-1">Company Rankings</h3>

        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-3.5 text-xs font-bold text-gray-400 tracking-wider">Rank</th>
                <th className="py-3.5 text-xs font-bold text-gray-400 tracking-wider">Company Name</th>
                <th className="py-3.5 text-xs font-bold text-gray-400 tracking-wider">Drivers</th>
                <th className="py-3.5 text-xs font-bold text-gray-400 tracking-wider">Locations</th>
                <th className="py-3.5 text-xs font-bold text-gray-400 tracking-wider">Average Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {TABLE_ROWS.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4.5 text-xs font-bold text-gray-900">{row.rank}</td>
                  <td className="py-4.5 text-xs font-extrabold text-gray-950">{row.name}</td>
                  <td className="py-4.5 text-xs font-semibold text-gray-500">{row.drivers}</td>
                  <td className="py-4.5 text-xs font-semibold text-gray-500">{row.location}</td>
                  <td className="py-4.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-gray-955">{row.score}</span>
                      <div className="flex items-center gap-0.5 text-[10px] font-bold text-[#008A45]">
                        <TrendingUp className="w-3 h-3" />
                        <span>{row.trend}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Bottom Pagination controls */}
        <div className="flex justify-end items-center gap-2 pt-2 border-t border-gray-50">
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-400 transition-colors cursor-pointer disabled:opacity-50" disabled>
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>
          
          <button className="w-8 h-8 rounded-lg bg-[#D13900] text-white flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer border border-[#D13900]">
            1
          </button>
          <button className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-500 flex items-center justify-center font-bold text-xs hover:bg-gray-50 transition-colors cursor-pointer">
            2
          </button>
          <button className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-500 flex items-center justify-center font-bold text-xs hover:bg-gray-50 transition-colors cursor-pointer">
            3
          </button>
          
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-400 transition-colors cursor-pointer">
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
