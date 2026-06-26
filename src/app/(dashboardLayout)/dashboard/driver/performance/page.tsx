"use client";

import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  Shield,
  Calendar,
  Trophy,
  Star,
  Zap,
  Wrench,
  Gauge,
  Award,
} from "lucide-react";

export default function DriverPerformancePage() {
  return (
    <div className="w-full flex flex-col gap-6 font-poppins select-text pb-12 text-left animate-fade-in">
      
      {/* Top 3 KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Card 1: My Average Score */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div className="space-y-2 text-left">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">My Average Score</p>
            <p className="text-3xl font-black text-gray-900 leading-tight">90.4</p>
            <div className="flex items-center gap-1 text-[10px] font-bold text-[#008A45]">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+3 vs last week</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#D13900] flex items-center justify-center text-white shrink-0 shadow-sm">
            <Shield className="w-6 h-6 stroke-[1.5]" />
          </div>
        </div>

        {/* Card 2: My Best Week */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div className="space-y-2 text-left">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">My Best Week</p>
            <p className="text-3xl font-black text-gray-900 leading-tight">94.6</p>
            <p className="text-[10px] font-bold text-[#008A45]">Highest score achieved</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#008A45] flex items-center justify-center text-white shrink-0 shadow-sm">
            <Shield className="w-6 h-6 stroke-[1.5]" />
          </div>
        </div>

        {/* Card 3: Active Days */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div className="space-y-2 text-left">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Days</p>
            <p className="text-3xl font-black text-gray-900 leading-tight">184 Days</p>
            <p className="text-[10px] font-bold text-gray-400">Total days driven</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#EBF8FE] flex items-center justify-center text-[#0BA8CC] shrink-0 shadow-sm">
            <Calendar className="w-6 h-6 stroke-[1.5]" />
          </div>
        </div>

      </div>

      {/* Second Row: Scoring System + Recent Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Scoring System Card */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="text-left mb-6">
            <h3 className="text-base font-black text-gray-900">Scoring System</h3>
          </div>

          <div className="space-y-4">
            
            {/* Safety Score */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-[#D13900] shrink-0">
                  <Shield className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-900">Safety Score</p>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Driving safety and compliance</p>
                </div>
              </div>
              <div className="text-right font-bold text-[10px] space-y-0.5">
                <p className="text-gray-900 font-black">Score Range - 90</p>
                <p className="text-gray-400 font-semibold">Rank #2 of 48</p>
              </div>
            </div>

            {/* Fuel Efficiency */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-[#008A45] shrink-0">
                  <Gauge className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-900">Fuel Efficiency</p>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Fuel usage and efficiency</p>
                </div>
              </div>
              <div className="text-right font-bold text-[10px] space-y-0.5">
                <p className="text-gray-900 font-black">Score Range - 90</p>
                <p className="text-gray-400 font-semibold">Rank #5 of 48</p>
              </div>
            </div>

            {/* Attendance */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-[#FAAD14] shrink-0">
                  <Calendar className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-900">Attendance</p>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Punctuality and availability</p>
                </div>
              </div>
              <div className="text-right font-bold text-[10px] space-y-0.5">
                <p className="text-gray-900 font-black">Score Range - 90</p>
                <p className="text-gray-400 font-semibold">Rank #1 of 48</p>
              </div>
            </div>

            {/* Customer Feedback */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#0BA8CC] shrink-0">
                  <Star className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-900">Customer Feedback</p>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Customer ratings and feedback</p>
                </div>
              </div>
              <div className="text-right font-bold text-[10px] space-y-0.5">
                <p className="text-gray-900 font-black">Score Range - 90</p>
                <p className="text-gray-400 font-semibold">Rank #2 of 48</p>
              </div>
            </div>

            {/* Vehicle Maintenance */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-[#D13900] shrink-0">
                  <Wrench className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-900">Vehicle Maintenance</p>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Vehicle condition and upkeep</p>
                </div>
              </div>
              <div className="text-right font-bold text-[10px] space-y-0.5">
                <p className="text-gray-900 font-black">Score Range - 90</p>
                <p className="text-gray-400 font-semibold">Rank #1 of 48</p>
              </div>
            </div>

          </div>
        </div>

        {/* Recent Achievements Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="text-left mb-6">
            <h3 className="text-base font-black text-gray-900">Recent Achievements</h3>
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item, idx) => (
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
                  <p className="text-gray-750">May 27, 2024</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Third Row: All Week Challenges Results */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-black text-gray-900">All Week Challenges Results</h3>
          <button className="text-[11px] font-bold text-[#D13900] hover:underline uppercase tracking-wider cursor-pointer">
            View all
          </button>
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7].map((item, idx) => (
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
  );
}
