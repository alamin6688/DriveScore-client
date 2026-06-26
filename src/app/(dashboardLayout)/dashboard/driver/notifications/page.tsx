"use client";

import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";

const INITIAL_NOTIFICATIONS = [
  { id: "1", title: "Week 24 Competition Started", description: "The new weekly challenge is now live. Good luck!", time: "10:20 am" },
  { id: "2", title: "Week 24 Competition Started", description: "The new weekly challenge is now live. Good luck!", time: "10:20 am" },
  { id: "3", title: "Week 24 Competition Started", description: "The new weekly challenge is now live. Good luck!", time: "10:20 am" },
  { id: "4", title: "Week 24 Competition Started", description: "The new weekly challenge is now live. Good luck!", time: "10:20 am" },
  { id: "5", title: "Performance data uploaded successfully", description: "245 driver records processed successfully.", time: "10:20 am" },
  { id: "6", title: "Week 24 Competition Started", description: "The new weekly challenge is now live. Good luck!", time: "10:20 am" },
  { id: "7", title: "Week 24 Competition Started", description: "The new weekly challenge is now live. Good luck!", time: "10:20 am" },
];

export default function DriverNotificationsPage() {
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
            {/* Left Circle Icon */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FFEBEB] text-[#D13900] flex items-center justify-center shrink-0 border border-red-150/40">
                <Bell className="w-5 h-5 fill-current" />
              </div>
              
              {/* Notification Message Details */}
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-gray-900 leading-tight">
                  {notif.title}
                </h4>
                <p className="text-xs text-gray-450 font-medium leading-normal">
                  {notif.description}
                </p>
              </div>
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
