"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Upload,
  Building,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface LogItem {
  id: string;
  dateTime: string;
  user: string;
  company: string;
  activity: string;
  status: "Success" | "Failed";
}

const KPI_CARDS = [
  {
    id: "activities",
    title: "Total Activities",
    value: "248",
    icon: <FileText className="w-5.5 h-5.5 stroke-[1.5]" />,
    iconBg: "bg-[#F3E8FF]",
    iconColor: "text-[#8B5CF6]",
  },
  {
    id: "uploads",
    title: "Uploads Today",
    value: "156",
    icon: <Upload className="w-5.5 h-5.5 stroke-[1.5]" />,
    iconBg: "bg-[#258200]",
    iconColor: "text-white",
  },
  {
    id: "companies",
    title: "New Companies",
    value: "40",
    icon: <Building className="w-5.5 h-5.5 stroke-[1.5]" />,
    iconBg: "bg-[#EAF8FF]",
    iconColor: "text-[#1890FF]",
  },
  {
    id: "failed",
    title: "Failed Actions",
    value: "12",
    icon: <AlertTriangle className="w-5.5 h-5.5 stroke-[1.5]" />,
    iconBg: "bg-[#D13900]",
    iconColor: "text-white",
  },
];

const INITIAL_LOGS: LogItem[] = [
  { id: "1", dateTime: "27 May,2027, 10:00 PM", user: "John Smith - Admin", company: "Alpha Fleet", activity: "Uploaded Excel File", status: "Success" },
  { id: "2", dateTime: "27 May,2027, 10:00 PM", user: "John Smith - Admin", company: "Alpha Fleet", activity: "Uploaded Excel File", status: "Success" },
  { id: "3", dateTime: "27 May,2027, 10:00 PM", user: "John Smith - Admin", company: "Alpha Fleet", activity: "Uploaded Excel File", status: "Success" },
  { id: "4", dateTime: "27 May,2027, 10:00 PM", user: "John Smith - Admin", company: "Alpha Fleet", activity: "Uploaded Excel File", status: "Success" },
  { id: "5", dateTime: "27 May,2027, 10:00 PM", user: "John Smith - Admin", company: "Alpha Fleet", activity: "Uploaded Excel File", status: "Success" },
  { id: "6", dateTime: "27 May,2027, 10:00 PM", user: "John Smith - Admin", company: "Alpha Fleet", activity: "Uploaded Excel File", status: "Failed" },
  { id: "7", dateTime: "27 May,2027, 10:00 PM", user: "John Smith - Admin", company: "Alpha Fleet", activity: "Uploaded Excel File", status: "Success" },
  { id: "8", dateTime: "27 May,2027, 10:00 PM", user: "John Smith - Admin", company: "Alpha Fleet", activity: "Uploaded Excel File", status: "Success" },
  { id: "9", dateTime: "27 May,2027, 10:00 PM", user: "John Smith - Admin", company: "Alpha Fleet", activity: "Uploaded Excel File", status: "Failed" },
];

export default function AdminActivityLogsPage() {
  const [mounted, setMounted] = useState(false);
  const [logs] = useState<LogItem[]>(INITIAL_LOGS);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getStatusBadgeClass = (status: "Success" | "Failed") => {
    return status === "Success" ? "bg-[#EAFBEE] text-[#52C41A]" : "bg-[#FFEBEB] text-[#FF4D4F]";
  };

  if (!mounted) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center text-gray-400 font-medium font-poppins">
        Loading Logs...
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

      {/* Activity Logs Table Card Container */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col gap-5">
        <h3 className="text-base font-black text-gray-900 px-1">Activity Logs</h3>

        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-3.5 text-xs font-bold text-gray-400 tracking-wider">Date & Time</th>
                <th className="py-3.5 text-xs font-bold text-gray-400 tracking-wider">User</th>
                <th className="py-3.5 text-xs font-bold text-gray-400 tracking-wider">Company</th>
                <th className="py-3.5 text-xs font-bold text-gray-400 tracking-wider">Activity</th>
                <th className="py-3.5 text-xs font-bold text-gray-400 tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4.5 text-xs font-semibold text-gray-500">{log.dateTime}</td>
                  <td className="py-4.5 text-xs font-extrabold text-gray-950">{log.user}</td>
                  <td className="py-4.5 text-xs font-semibold text-gray-500">{log.company}</td>
                  <td className="py-4.5 text-xs font-semibold text-gray-500">{log.activity}</td>
                  <td className="py-4.5">
                    <span className={`inline-flex px-3.5 py-1 rounded-full text-[10px] font-bold ${getStatusBadgeClass(log.status)}`}>
                      {log.status}
                    </span>
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
