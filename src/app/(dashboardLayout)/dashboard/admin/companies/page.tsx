"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Building2,
  Building,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";

interface Company {
  id: string;
  code: string;
  name: string;
  country: string;
  drivers: number;
  date: string;
  status: "Active" | "Inactive" | "Suspended";
}

const KPI_CARDS = [
  {
    id: "total",
    title: "Total Companies",
    value: "248",
    icon: <Building2 className="w-5.5 h-5.5 stroke-[1.5]" />,
    iconBg: "bg-[#FFEBEB]",
    iconColor: "text-[#D13900]",
  },
  {
    id: "active",
    title: "Active Companies",
    value: "112",
    icon: <Building className="w-5.5 h-5.5 stroke-[1.5]" />,
    iconBg: "bg-[#EAFBEE]",
    iconColor: "text-[#52C41A]",
  },
  {
    id: "inactive",
    title: "Inactive",
    value: "40",
    icon: <Building className="w-5.5 h-5.5 stroke-[1.5]" />,
    iconBg: "bg-[#FFFBE6]",
    iconColor: "text-[#FAAD14]",
  },
  {
    id: "suspended",
    title: "Suspended",
    value: "10",
    icon: <Building className="w-5.5 h-5.5 stroke-[1.5]" />,
    iconBg: "bg-[#FFEBEB]",
    iconColor: "text-[#FF4D4F]",
  },
];

const INITIAL_COMPANIES: Company[] = [
  { id: "1", code: "#125078", name: "Alpha Fleet", country: "USA", drivers: 423, date: "27 May,2027", status: "Active" },
  { id: "2", code: "#125078", name: "Alpha Fleet", country: "USA", drivers: 423, date: "27 May,2027", status: "Inactive" },
  { id: "3", code: "#125078", name: "Alpha Fleet", country: "USA", drivers: 423, date: "27 May,2027", status: "Suspended" },
  { id: "4", code: "#125078", name: "Alpha Fleet", country: "USA", drivers: 423, date: "27 May,2027", status: "Active" },
  { id: "5", code: "#125078", name: "Alpha Fleet", country: "USA", drivers: 423, date: "27 May,2027", status: "Inactive" },
  { id: "6", code: "#125078", name: "Alpha Fleet", country: "USA", drivers: 423, date: "27 May,2027", status: "Suspended" },
  { id: "7", code: "#125078", name: "Alpha Fleet", country: "USA", drivers: 423, date: "27 May,2027", status: "Active" },
];

export default function AdminCompaniesPage() {
  const [mounted, setMounted] = useState(false);
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
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

  const handleSuspendCompany = (id: string) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Suspended" } : c))
    );
    setOpenDropdownId(null);
  };

  if (!mounted) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center text-gray-400 font-medium font-poppins">
        Loading Companies...
      </div>
    );
  }

  // Filter companies based on search
  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadgeClass = (status: "Active" | "Inactive" | "Suspended") => {
    switch (status) {
      case "Active":
        return "bg-[#EAFBEE] text-[#52C41A]";
      case "Inactive":
        return "bg-[#FFFBE6] text-[#FAAD14]";
      case "Suspended":
        return "bg-[#FFEBEB] text-[#FF4D4F]";
    }
  };

  const handleOpenModal = (company: Company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCompany(null);
  };

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

      {/* Main Table Card Container */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col gap-5">
        {/* Search Input Bar */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search company code or name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-100 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#D13900] text-xs font-semibold text-gray-800 placeholder-gray-400 transition-all bg-[#FAFAFA]"
          />
        </div>

        {/* Company List Table Section */}
        <div className="space-y-4">
          <h3 className="text-base font-black text-gray-900 px-1">Company List</h3>
          
          <div className="overflow-x-auto w-full">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-3.5 text-xs font-bold text-gray-400 tracking-wider">Company Code</th>
                  <th className="py-3.5 text-xs font-bold text-gray-400 tracking-wider">Company Name</th>
                  <th className="py-3.5 text-xs font-bold text-gray-400 tracking-wider">Country</th>
                  <th className="py-3.5 text-xs font-bold text-gray-400 tracking-wider">Drivers</th>
                  <th className="py-3.5 text-xs font-bold text-gray-400 tracking-wider">Joining Date</th>
                  <th className="py-3.5 text-xs font-bold text-gray-400 tracking-wider">Status</th>
                  <th className="py-3.5 text-xs font-bold text-gray-400 tracking-wider text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCompanies.map((company, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4.5 text-xs font-semibold text-gray-500">{company.code}</td>
                    <td className="py-4.5 text-xs font-extrabold text-gray-950">{company.name}</td>
                    <td className="py-4.5 text-xs font-semibold text-gray-500">{company.country}</td>
                    <td className="py-4.5 text-xs font-semibold text-gray-500">{company.drivers}</td>
                    <td className="py-4.5 text-xs font-semibold text-gray-500">{company.date}</td>
                    <td className="py-4.5">
                      <span className={`inline-flex px-3.5 py-1 rounded-full text-[10px] font-bold ${getStatusBadgeClass(company.status)}`}>
                        {company.status}
                      </span>
                    </td>
                    <td className="py-4.5">
                      <div className="flex justify-center relative action-menu-container">
                        <button
                          onClick={() => setOpenDropdownId(openDropdownId === company.id ? null : company.id)}
                          className="w-7 h-7 rounded-full bg-[#FFEBEB] text-[#D13900] flex items-center justify-center cursor-pointer hover:bg-[#FDD8D8] transition-colors shadow-sm"
                          aria-label="Action Menu"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu Overlay */}
                        {openDropdownId === company.id && (
                          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-150 rounded-2xl shadow-xl z-40 p-2 flex flex-col gap-1 w-36 select-none animate-in fade-in slide-in-from-top-2 duration-150 text-left">
                            <button
                              onClick={() => {
                                handleOpenModal(company);
                                setOpenDropdownId(null);
                              }}
                              className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs font-bold text-gray-600 hover:bg-gray-50/50 hover:text-gray-900 transition-colors"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => handleSuspendCompany(company.id)}
                              className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs font-bold text-[#FF4D4F] hover:bg-red-50/50 transition-colors"
                            >
                              Suspended
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredCompanies.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs font-semibold text-gray-400">
                      No companies found matching search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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

      {/* Detailed Modal View Popup Overlay */}
      {isModalOpen && selectedCompany && mounted && createPortal(
        <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-9999 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-[440px] p-8 flex flex-col shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Title and Close Button Flex Container */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6 text-left">
              <h3 className="text-xl font-bold text-gray-950">Company Details</h3>
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
                <span className="font-extrabold text-gray-950">Company Name : </span>
                <span className="font-semibold text-gray-500">{selectedCompany.name}</span>
              </p>
              <p className="text-gray-800">
                <span className="font-extrabold text-gray-955">Country : </span>
                <span className="font-semibold text-gray-500">{selectedCompany.country}</span>
              </p>
              <p className="text-gray-800">
                <span className="font-extrabold text-gray-955">Drivers: </span>
                <span className="font-semibold text-gray-500">{selectedCompany.drivers}</span>
              </p>
              <p className="text-gray-800">
                <span className="font-extrabold text-gray-955">Joining Date: </span>
                <span className="font-semibold text-gray-500">{selectedCompany.date}</span>
              </p>
              <div className="pt-2">
                <span className={`inline-flex px-3.5 py-1 rounded-full text-[10px] font-bold ${getStatusBadgeClass(selectedCompany.status)}`}>
                  {selectedCompany.status}
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
