"use client";

import React, { useState, useEffect } from "react";
import {
  Trophy,
  Shield,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Zap,
  AlertTriangle,
  Gauge,
  Truck,
  Image as ImageIcon,
  Headphones,
  MapPin,
  ShieldAlert,
  Package,
  Compass,
} from "lucide-react";

// Mock data for Safety Score Breakdown
const SAFETY_METRICS = [
  {
    id: "s1",
    name: "Speeding",
    desc: "Speeding incidents",
    score: 92,
    weight: "30%",
    change: "+8 From last week",
    icon: <Gauge className="w-5 h-5" />,
    colorClass: "bg-red-50 text-red-500",
  },
  {
    id: "s2",
    name: "Seatbelt Off",
    desc: "Seatbelt off incidents",
    score: 92,
    weight: "10%",
    change: "+8 From last week",
    icon: <ShieldAlert className="w-5 h-5" />,
    colorClass: "bg-green-50 text-green-600",
  },
  {
    id: "s3",
    name: "Distractions",
    desc: "Distracted driving incidents",
    score: 92,
    weight: "30%",
    change: "+8 From last week",
    icon: <AlertTriangle className="w-5 h-5" />,
    colorClass: "bg-red-50 text-red-500",
  },
  {
    id: "s4",
    name: "Sign/Signal Violations",
    desc: "Turn signal & sign violations",
    score: 92,
    weight: "10%",
    change: "+8 From last week",
    icon: <Compass className="w-5 h-5" />,
    colorClass: "bg-amber-50 text-amber-500",
  },
  {
    id: "s5",
    name: "Following Distance",
    desc: "Following distance incidents",
    score: 92,
    weight: "20%",
    change: "+8 From last week",
    icon: <MapPin className="w-5 h-5" />,
    colorClass: "bg-purple-50 text-purple-500",
  },
];

// Mock data for Quality Score Breakdown
const QUALITY_METRICS = [
  {
    id: "q1",
    name: "Customer Feedback",
    desc: "Customer satisfaction rating",
    score: 92,
    weight: "30%",
    change: "+8 From last week",
    icon: <Headphones className="w-5 h-5" />,
    colorClass: "bg-red-50 text-red-500",
  },
  {
    id: "q2",
    name: "Delivery Completion",
    desc: "Defects Opportunities",
    score: 92,
    weight: "10%",
    change: "+8 From last week",
    icon: <Truck className="w-5 h-5" />,
    colorClass: "bg-green-50 text-green-600",
  },
  {
    id: "q3",
    name: "Delivery Success Behavior",
    desc: "Delivery success behavior",
    score: 92,
    weight: "30%",
    change: "+8 From last week",
    icon: <Sparkles className="w-5 h-5" />,
    colorClass: "bg-red-50 text-red-500",
  },
  {
    id: "q4",
    name: "POD Photos",
    desc: "Proof of delivery photos",
    score: 92,
    weight: "10%",
    change: "+8 From last week",
    icon: <ImageIcon className="w-5 h-5" />,
    colorClass: "bg-amber-50 text-amber-500",
  },
  {
    id: "q5",
    name: "Package Delivered",
    desc: "Packages",
    score: 92,
    weight: "20%",
    change: "+8 From last week",
    icon: <Package className="w-5 h-5" />,
    colorClass: "bg-purple-50 text-purple-500",
  },
];

// Mock data for Challenge Results
const CHALLENGES = [
  { id: "c1", title: "Week-24 Challenge", subtitle: "248 records - May 19, 2026", score: 94.8 },
  { id: "c2", title: "Week-24 Challenge", subtitle: "248 records - May 19, 2026", score: 94.8 },
  { id: "c3", title: "Week-24 Challenge", subtitle: "248 records - May 19, 2026", score: 94.8 },
  { id: "c4", title: "Week-24 Challenge", subtitle: "248 records - May 19, 2026", score: 94.8 },
  { id: "c5", title: "Week-24 Challenge", subtitle: "248 records - May 19, 2026", score: 94.8 },
  { id: "c6", title: "Week-24 Challenge", subtitle: "248 records - May 19, 2026", score: 94.8 },
  { id: "c7", title: "Week-24 Challenge", subtitle: "248 records - May 19, 2026", score: 94.8 },
];

export default function DriverPerformancePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center text-gray-400 font-medium">
        Loading Performance...
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 font-poppins pb-12 text-left animate-fade-in select-text">
      
      {/* My Standings Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: My Position */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-start gap-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 rounded-full bg-[#E11D48] flex items-center justify-center text-white shrink-0 shadow-sm">
            <Trophy className="w-6 h-6" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="text-sm font-bold text-gray-905">Position</span>
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
              <span className="text-sm font-bold text-gray-905">Safety Score</span>
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
              <span className="text-sm font-bold text-gray-905">Quality Score</span>
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
              <span className="text-sm font-bold text-gray-905">Overall Score</span>
              <div className="flex items-center text-[10px] font-bold text-[#008A45] shrink-0">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+8 From last week</span>
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900 mt-2 leading-none">93.8</p>
          </div>
        </div>
      </div>

      {/* Breakdowns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Safety Score Breakdown Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-base font-black text-gray-900">Safety Score Breakdown</h3>
              <span className="text-2xl font-black text-red-600">96</span>
            </div>
            <p className="text-[10px] text-gray-400 font-semibold mb-6">Total weight: 70% of Overall Score</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[450px]">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="pb-3">Metric</th>
                    <th className="pb-3 text-center">Your Score</th>
                    <th className="pb-3 text-center">Weight</th>
                    <th className="pb-3 text-right">vs Last Week</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">
                  {SAFETY_METRICS.map((metric) => (
                    <tr key={metric.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${metric.colorClass}`}>
                            {metric.icon}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{metric.name}</p>
                            <p className="text-[9px] text-gray-400 font-medium mt-0.5">{metric.desc}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 text-center font-black text-gray-900">{metric.score}</td>
                      <td className="py-3.5 text-center text-gray-400 font-medium">{metric.weight}</td>
                      <td className="py-3.5">
                        <div className="flex items-center justify-end text-[10px] font-bold text-[#008A45] gap-0.5">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          <span>{metric.change}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quality Score Breakdown Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-base font-black text-gray-900">Quality Score Breakdown</h3>
              <span className="text-2xl font-black text-red-600">96</span>
            </div>
            <p className="text-[10px] text-gray-400 font-semibold mb-6">Total weight: 30% of Overall Score</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[450px]">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="pb-3">Metric</th>
                    <th className="pb-3 text-center">Your Score</th>
                    <th className="pb-3 text-center">Weight</th>
                    <th className="pb-3 text-right">vs Last Week</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">
                  {QUALITY_METRICS.map((metric) => (
                    <tr key={metric.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${metric.colorClass}`}>
                            {metric.icon}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{metric.name}</p>
                            <p className="text-[9px] text-gray-400 font-medium mt-0.5">{metric.desc}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 text-center font-black text-gray-900">{metric.score}</td>
                      <td className="py-3.5 text-center text-gray-400 font-medium">{metric.weight}</td>
                      <td className="py-3.5">
                        <div className="flex items-center justify-end text-[10px] font-bold text-[#008A45] gap-0.5">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          <span>{metric.change}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* All Week Challenges Results */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-black text-gray-900">All Week Challanges Results</h3>
          <span className="text-[11px] font-bold text-[#D13900] hover:underline uppercase tracking-wider cursor-pointer select-none">
            View all
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {CHALLENGES.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#FF3B30] flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Trophy className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-900">{item.title}</p>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{item.subtitle}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-gray-950">{item.score}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
