"use client";

import React, { useState, useEffect } from "react";
import { Building } from "lucide-react";

const INITIAL_NOTIFICATIONS = [
  { id: "1", company: "RoadFast Logistics", time: "10:30 AM" },
  { id: "2", company: "RoadFast Logistics", time: "10:30 AM" },
  { id: "3", company: "RoadFast Logistics", time: "10:30 AM" },
  { id: "4", company: "RoadFast Logistics", time: "10:30 AM" },
  { id: "5", company: "RoadFast Logistics", time: "10:30 AM" },
  { id: "6", company: "RoadFast Logistics", time: "10:30 AM" },
  { id: "7", company: "RoadFast Logistics", time: "10:30 AM" },
];

export default function AdminNotificationsPage() {
  const [mounted, setMounted] = useState(false);
  const [notifications] = useState(INITIAL_NOTIFICATIONS);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center text-gray-400 font-medium font-poppins">
        Loading Notifications...
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 font-poppins pb-12 select-text animate-fade-in text-left">
      {/* Notifications List Container */}
      <div className="space-y-4 max-w-5xl mx-auto">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 flex items-center justify-between gap-4"
          >
            {/* Left Circle Icon and Text */}
            <div className="flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-full bg-[#FFEBEB] text-[#D13900] flex items-center justify-center shrink-0 border border-red-150/40">
                <Building className="w-5 h-5 stroke-[1.8]" />
              </div>
              <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
                New company <span className="font-extrabold text-gray-900">{notif.company}</span> has registered on the platform.
              </p>
            </div>

            {/* Time Stamp */}
            <div className="text-right shrink-0">
              <span className="text-xs font-bold text-gray-400 tracking-wide">
                {notif.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
