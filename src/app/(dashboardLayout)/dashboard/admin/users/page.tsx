"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Users,
  UserCheck,
  UserCog,
  X,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  role: "Company Admin" | "Driver";
  company: string;
  email: string;
  status: "Active" | "Inactive";
}

const KPI_CARDS = [
  {
    id: "total",
    title: "Total Users",
    value: "6,248",
    icon: <Users className="w-5.5 h-5.5 stroke-[1.5]" />,
    iconBg: "bg-[#D13900]",
    iconColor: "text-white",
  },
  {
    id: "admins",
    title: "Company Admins",
    value: "112",
    icon: <UserCog className="w-5.5 h-5.5 stroke-[1.5]" />,
    iconBg: "bg-[#8B5CF6]",
    iconColor: "text-white",
  },
  {
    id: "drivers",
    title: "Drivers",
    value: "5,140",
    icon: <Users className="w-5.5 h-5.5 stroke-[1.5]" />,
    iconBg: "bg-[#EAF8FF]",
    iconColor: "text-[#1890FF]",
  },
  {
    id: "active",
    title: "Active Users",
    value: "10,000",
    icon: <UserCheck className="w-5.5 h-5.5 stroke-[1.5]" />,
    iconBg: "bg-[#258200]",
    iconColor: "text-white",
  },
];

const INITIAL_USERS: UserItem[] = [
  { id: "1", name: "Watson Smith", role: "Company Admin", company: "Alpha Fleet", email: "Example@email.com", status: "Active" },
  { id: "2", name: "Watson Smith", role: "Company Admin", company: "Alpha Fleet", email: "Example@email.com", status: "Active" },
  { id: "3", name: "Watson Smith", role: "Company Admin", company: "Alpha Fleet", email: "Example@email.com", status: "Inactive" },
  { id: "4", name: "Watson Smith", role: "Company Admin", company: "Alpha Fleet", email: "Example@email.com", status: "Active" },
  { id: "5", name: "Watson Smith", role: "Company Admin", company: "Alpha Fleet", email: "Example@email.com", status: "Inactive" },
  { id: "6", name: "Watson Smith", role: "Driver", company: "Alpha Fleet", email: "Example@email.com", status: "Active" },
  { id: "7", name: "Watson Smith", role: "Driver", company: "Alpha Fleet", email: "Example@email.com", status: "Active" },
  { id: "8", name: "Watson Smith", role: "Driver", company: "Alpha Fleet", email: "Example@email.com", status: "Inactive" },
  { id: "9", name: "Watson Smith", role: "Driver", company: "Alpha Fleet", email: "Example@email.com", status: "Active" },
];

export default function AdminUserManagementPage() {
  const [mounted, setMounted] = useState(false);
  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".action-menu-container")) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleDeactivateUser = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "Inactive" } : u))
    );
    setOpenDropdownId(null);
  };

  const handleOpenModal = (user: UserItem) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const getStatusBadgeClass = (status: "Active" | "Inactive") => {
    return status === "Active" ? "bg-[#EAFBEE] text-[#52C41A]" : "bg-[#FFFBE6] text-[#FAAD14]";
  };

  if (!mounted) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center text-gray-400 font-medium font-poppins">
        Loading Users...
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

      {/* Users Table Card Container */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col gap-5">
        <h3 className="text-base font-black text-gray-900 px-1">All Users</h3>

        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-3.5 text-xs font-bold text-gray-400 tracking-wider">Name</th>
                <th className="py-3.5 text-xs font-bold text-gray-400 tracking-wider">Role</th>
                <th className="py-3.5 text-xs font-bold text-gray-400 tracking-wider">Company</th>
                <th className="py-3.5 text-xs font-bold text-gray-400 tracking-wider">Email</th>
                <th className="py-3.5 text-xs font-bold text-gray-400 tracking-wider">Status</th>
                <th className="py-3.5 text-xs font-bold text-gray-400 tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4.5 text-xs font-extrabold text-gray-950">{user.name}</td>
                  <td className="py-4.5 text-xs font-semibold text-gray-500">{user.role}</td>
                  <td className="py-4.5 text-xs font-semibold text-gray-500">{user.company}</td>
                  <td className="py-4.5 text-xs font-semibold text-gray-500">{user.email}</td>
                  <td className="py-4.5">
                    <span className={`inline-flex px-3.5 py-1 rounded-full text-[10px] font-bold ${getStatusBadgeClass(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4.5">
                    <div className="flex justify-center relative action-menu-container">
                      <button
                        onClick={() => setOpenDropdownId(openDropdownId === user.id ? null : user.id)}
                        className="w-7 h-7 rounded-full bg-[#FFEBEB] text-[#D13900] flex items-center justify-center cursor-pointer hover:bg-[#FDD8D8] transition-colors shadow-sm"
                        aria-label="Action Menu"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu Overlay */}
                      {openDropdownId === user.id && (
                        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-150 rounded-2xl shadow-xl z-40 p-2 flex flex-col gap-1 w-36 select-none animate-in fade-in slide-in-from-top-2 duration-150 text-left">
                          <button
                            onClick={() => {
                              handleOpenModal(user);
                              setOpenDropdownId(null);
                            }}
                            className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs font-bold text-gray-600 hover:bg-gray-50/50 hover:text-gray-900 transition-colors"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleDeactivateUser(user.id)}
                            className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs font-bold text-[#FF4D4F] hover:bg-red-50/50 transition-colors"
                          >
                            Deactivate User
                          </button>
                        </div>
                      )}
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

      {/* User Details Modal View Portal Overlay */}
      {isModalOpen && selectedUser && mounted && createPortal(
        <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-9999 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-[440px] p-8 flex flex-col shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Title and Close Button Flex Container */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6 text-left">
              <h3 className="text-xl font-bold text-gray-800">User Details</h3>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full bg-[#FFEBEB] text-[#D13900] flex items-center justify-center hover:bg-[#FDD8D8] transition-colors cursor-pointer shadow-sm"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Modal Content Details */}
            <div className="space-y-4 text-left text-sm">
              <p className="text-gray-800">
                <span className="font-extrabold text-gray-955">Name : </span>
                <span className="font-semibold text-gray-500">{selectedUser.name}</span>
              </p>
              <p className="text-gray-800">
                <span className="font-extrabold text-gray-955">Role : </span>
                <span className="font-semibold text-gray-500">{selectedUser.role}</span>
              </p>
              <p className="text-gray-800">
                <span className="font-extrabold text-gray-955">Company Name : </span>
                <span className="font-semibold text-gray-500">{selectedUser.company}</span>
              </p>
              <p className="text-gray-800">
                <span className="font-extrabold text-gray-955">Email : </span>
                <span className="font-semibold text-gray-500">Daniel Carter@gmail.com</span>
              </p>
              <div className="pt-2">
                <span className={`inline-flex px-3.5 py-1 rounded-full text-[10px] font-bold ${getStatusBadgeClass(selectedUser.status)}`}>
                  {selectedUser.status}
                </span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
