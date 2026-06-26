"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  Trophy,
  Upload,
  ChevronDown,
  Building,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const GROWTH_DATA = [
  { name: "Jan '24", display: "Jan '24", value: 16 },
  { name: "Feb '24", display: "", value: 22 },
  { name: "Mar '24", display: "Mar '24", value: 24 },
  { name: "Apr '24", display: "", value: 31 },
  { name: "May '24", display: "May '24", value: 28 },
  { name: "Jun '24", display: "", value: 37 },
];

const KPI_CARDS = [
  {
    id: "companies",
    title: "Total Companies",
    value: "248",
    icon: <Building2 className="w-5.5 h-5.5 stroke-[1.5]" />,
    iconBg: "bg-[#FFEBEB]",
    iconColor: "text-[#D13900]",
  },
  {
    id: "drivers",
    title: "Total Drivers",
    value: "5,643",
    icon: <Users className="w-5.5 h-5.5 stroke-[1.5]" />,
    iconBg: "bg-[#EAF8FF]",
    iconColor: "text-[#1890FF]",
  },
  {
    id: "competition",
    title: "Active Competition",
    value: "40",
    icon: <Trophy className="w-5.5 h-5.5 stroke-[1.5]" />,
    iconBg: "bg-[#FFFBE6]",
    iconColor: "text-[#FAAD14]",
  },
  {
    id: "files",
    title: "Files Uploaded Today",
    value: "363",
    icon: <Upload className="w-5.5 h-5.5 stroke-[1.5]" />,
    iconBg: "bg-[#EAFBEE]",
    iconColor: "text-[#52C41A]",
  },
];

const RECENT_NOTIFICATIONS = [
  { id: "1", company: "RoadFast Logistics", time: "10:30 AM" },
  { id: "2", company: "RoadFast Logistics", time: "10:30 AM" },
  { id: "3", company: "RoadFast Logistics", time: "10:30 AM" },
];

export default function AdminDashboardOverview() {
  const [mounted, setMounted] = useState(false);
  const [timeframe, setTimeframe] = useState("last 6 months");
  const [timeframeDropdownOpen, setTimeframeDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center text-gray-400 font-medium font-poppins">
        Loading Overview...
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

      {/* Companies Growth Card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-black text-gray-900">Companies Growth</h3>
            <p className="text-xs text-gray-400 font-semibold">New Companies Joined</p>
            <p className="text-3xl font-black text-[#D13900] tracking-tight leading-none mt-1">
              +24
            </p>
          </div>

          {/* Timeframe Selection Dropdown */}
          <div className="relative">
            <button
              onClick={() => setTimeframeDropdownOpen(!timeframeDropdownOpen)}
              className="bg-[#EAFBEE] border border-gray-100 text-[#52C41A] hover:bg-[#d8f7e0] font-bold text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1 cursor-pointer transition-colors shadow-sm select-none"
            >
              <span>{timeframe}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#52C41A] transition-transform duration-200 ${timeframeDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {timeframeDropdownOpen && (
              <div className="absolute right-0 mt-1.5 bg-white border border-gray-150 rounded-xl shadow-lg py-1.5 z-30 w-36 select-none animate-in fade-in zoom-in-95 duration-100 text-left">
                {["last 3 months", "last 6 months", "last 12 months"].map((time) => (
                  <button
                    key={time}
                    onClick={() => {
                      setTimeframe(time);
                      setTimeframeDropdownOpen(false);
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

        {/* Recharts Bar Chart */}
        <div className="w-full pr-4 mt-2">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={GROWTH_DATA}
              margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
              barSize={55}
            >
              <defs>
                <linearGradient id="colorBarGrowth" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="5%" stopColor="#D13900" stopOpacity={0.75} />
                  <stop offset="95%" stopColor="#D13900" stopOpacity={0.12} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F5" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) =>
                  value.includes("Jan") || value.includes("Mar") || value.includes("May")
                    ? value
                    : ""
                }
                tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: "bold" }}
              />
              <YAxis
                domain={[0, 40]}
                ticks={[0, 10, 20, 30, 40]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: "bold" }}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #F1F3F5",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
                labelStyle={{ fontWeight: "bold", color: "#374151" }}
                itemStyle={{ color: "#D13900", fontWeight: "bold" }}
              />
              <Bar
                dataKey="value"
                fill="url(#colorBarGrowth)"
                radius={[12, 12, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Notifications Section */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-black text-gray-900">Recent Notifications</h3>
          <Link
            href="/dashboard/admin/notifications"
            className="text-xs font-bold text-[#D13900] hover:underline"
          >
            View all
          </Link>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-gray-100">
          {RECENT_NOTIFICATIONS.map((notif) => (
            <div
              key={notif.id}
              className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-10 h-10 rounded-full bg-[#FFEBEB] text-[#D13900] flex items-center justify-center shrink-0 border border-red-150/40">
                  <Building className="w-5 h-5 stroke-[1.8]" />
                </div>
                <p className="text-xs text-gray-700 font-medium leading-relaxed">
                  New company <span className="font-extrabold text-gray-900">{notif.company}</span> has registered on the platform.
                </p>
              </div>
              <span className="text-xs font-bold text-gray-400 tracking-wide shrink-0">
                {notif.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
