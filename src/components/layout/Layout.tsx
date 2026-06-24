"use client";

import React, { ReactNode, useMemo, useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Layout, Dropdown } from "antd";
import Link from "next/link";
import Image from "next/image";
import { LogOut, ChevronDown, RefreshCw, LayoutDashboard, FileText, ArrowLeftRight, Building2, BarChart3, Link as LinkIcon, Settings, Power, Plus, Loader2 } from "lucide-react";
import logo from "@/assets/logo/logo.png";
import {
  getProfileAvatar,
  getProfileName,
  useGetProfileDataQuery,
} from "@/service/profile/profileApi";
import { useLogoutMutation } from "@/service/auth/authApi";
import { logout } from "@/redux/features/auth";
import { useDispatch } from "react-redux";
import {
  unwrapCompanies,
  useGetCompaniesQuery,
  useSwitchCompanyMutation,
} from "@/service/companies/companiesApi";
import { appAlert } from "@/utils/appAlert";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

const { Sider, Header, Content } = Layout;

interface MenuItem {
  key: string;
  label: React.ReactNode;
  icon: React.ReactNode;
  className?: string;
}

interface AdminLayoutProps {
  children: ReactNode;
  menu?: MenuItem[];
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, menu }) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [companyImageErrors, setCompanyImageErrors] = useState<Record<string, boolean>>({});
  const [optimisticCompanyId, setOptimisticCompanyId] = useState<string | null>(null);
  const [switchingCompanyId, setSwitchingCompanyId] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const isUserDashboardRoute = pathname.startsWith("/dashboard/user");

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isDropdownOpen]);

  const { data: profileResponse, isLoading } = useGetProfileDataQuery();
  const user = profileResponse?.data || null;
  const {
    data: companiesResponse,
    isLoading: isCompaniesLoading,
    refetch: refetchCompanies,
  } = useGetCompaniesQuery(undefined, { skip: !isUserDashboardRoute });
  const [switchCompany, { isLoading: isSwitchingCompany }] = useSwitchCompanyMutation();
  const companies = useMemo(
    () => unwrapCompanies(companiesResponse?.data),
    [companiesResponse?.data]
  );
  const activeCompany = useMemo(
    () =>
      companies.find((company) => optimisticCompanyId && company.id === optimisticCompanyId) ||
      companies.find((company) => company.isDefault) ||
      companies[0] ||
      null,
    [companies, optimisticCompanyId]
  );

  useEffect(() => {
    setAvatarError(false);
  }, [user]);

  const menuToRender = menu || [];
  const selectedKey = pathname;

  const dispatch = useDispatch();
  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutMutation();
  
  const handleLogoutClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = async () => {
    try {
      await logoutUser().unwrap();
    } catch {
      // If the server session is already expired, still clear the frontend session.
    } finally {
      setIsLogoutModalOpen(false);
      dispatch(logout());
    }
  };

  const profileMenuItems = [
    {
      key: "logout",
      label: "Log out",
      icon: <LogOut size={16} />,
      danger: true,
      onClick: () => handleLogoutClick(),
    },
  ];

  const displayName = useMemo(() => {
    return getProfileName(user) || user?.email?.split("@")[0] || "User";
  }, [user]);

  const avatarUrl = useMemo(() => {
    const url = getProfileAvatar(user).trim();
    return url && url.length > 0 ? url : null;
  }, [user]);

  const fallbackInitial = useMemo(() => {
    const initial =
      user?.profile?.name?.trim()?.[0] ||
      user?.name?.trim()?.[0] ||
      user?.email?.trim()?.[0] ||
      "U";
    return initial.toUpperCase();
  }, [user]);

  const handleCompanySwitch = async (companyId: string, companyName: string) => {
    if (companyId === activeCompany?.id || isSwitchingCompany) return;

    setOptimisticCompanyId(companyId);
    setSwitchingCompanyId(companyId);

    try {
      await switchCompany(companyId).unwrap();
      await refetchCompanies();
      setOptimisticCompanyId(null);
      setSwitchingCompanyId(null);
      setIsDropdownOpen(false);
      appAlert.fire({
        icon: "success",
        title: `Switched to ${companyName}`,
        text: "Active working profile changed.",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      setOptimisticCompanyId(null);
      setSwitchingCompanyId(null);
      appAlert.fire({
        icon: "error",
        title: "Switch Failed",
        text: getApiErrorMessage(
          error,
          "Could not switch company. Please try again."
        ),
      });
    }
  };

  // Map route pathname to Page Title in Header
  const pageTitle = useMemo(() => {
    if (pathname === "/dashboard/user" || pathname === "/dashboard/admin") return "Overview";
    if (pathname.includes("/documents")) return "Documents";
    if (pathname.includes("/transactions")) return "Transactions";
    if (pathname.includes("/vendors")) return "Vendors";
    if (pathname.includes("/reports")) return "Reports";
    if (pathname.includes("/integrations")) return "Integrations";
    if (pathname.includes("/setting")) return "Settings";
    return "Dashboard";
  }, [pathname]);

  if (isLoading) {
    return null;
  }

  return (
    <Layout className="h-screen overflow-hidden font-poppins">
      {/* Sider Navigation */}
      <Sider
        width={240}
        collapsedWidth={0}
        breakpoint="lg"
        collapsed={false}
        trigger={null}
        theme="light"
        className={`bg-white border-r border-gray-100 fixed lg:relative h-full z-50 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 flex flex-col justify-between`}
      >
        <div className="flex flex-col h-full justify-between pb-6">
          <div>
            {/* Logo */}
            <div className="flex items-center justify-start px-6 py-5">
              <Link href="/">
                <Image
                  src={logo}
                  width={130}
                  height={38}
                  alt="ACCUSUM"
                  className="h-9 w-auto"
                />
              </Link>
            </div>

            {/* Company Dropdown Card */}
            {isUserDashboardRoute && (
            <div className="px-4 mb-4 relative" ref={dropdownRef}>
              <div
                onClick={() => setIsDropdownOpen((open) => !open)}
                className="border border-gray-100 bg-white rounded-2xl p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 shadow-sm transition-all select-none"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center font-bold text-[#4CAF50] text-xs shrink-0 overflow-hidden">
                    {activeCompany?.logoUrl && !companyImageErrors[activeCompany.id] ? (
                      <Image
                        src={activeCompany.logoUrl}
                        alt={activeCompany.name}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                        onError={() => {
                          if (activeCompany) {
                            setCompanyImageErrors((prev) => ({ ...prev, [activeCompany.id]: true }));
                          }
                        }}
                      />
                    ) : (
                      activeCompany
                        ? activeCompany.name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()
                        : "AC"
                    )}
                  </div>
                  <div className="text-left max-w-[120px]">
                    <p className="text-xs font-bold text-gray-900 leading-tight truncate">
                      {isCompaniesLoading
                        ? "Loading..."
                        : activeCompany
                          ? activeCompany.name
                          : user?.companyName || "No company"}
                    </p>
                  </div>
                </div>
                {isSwitchingCompany ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#258200]" />
                ) : (
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                )}
              </div>

              {/* Dropdown Menu Overlay */}
              {isDropdownOpen && (
                <div className="absolute left-4 right-4 mt-1 bg-white border border-gray-150 rounded-2xl shadow-xl z-9999 p-2 flex flex-col gap-1 select-none animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-2 py-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 mb-1">
                    Switch Company
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-0.5 scrollbar-hide">
                    {isCompaniesLoading && (
                      <div className="px-2 py-3 text-center text-[10px] font-bold text-gray-400">
                        Loading companies...
                      </div>
                    )}

                    {!isCompaniesLoading && companies.length === 0 && (
                      <div className="px-2 py-3 text-center text-[10px] font-bold text-gray-400">
                        No company available.
                      </div>
                    )}

                    {!isCompaniesLoading && companies.map((comp) => {
                      const isSelected = activeCompany?.id === comp.id;
                      const isSwitchingThisCompany = switchingCompanyId === comp.id;
                      const compInitials = comp.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase();

                      return (
                        <button
                          key={comp.id}
                          onClick={() => handleCompanySwitch(comp.id, comp.name)}
                          disabled={isSelected || isSwitchingCompany}
                          className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs font-bold transition-all disabled:cursor-not-allowed ${
                            isSelected || isSwitchingThisCompany
                              ? "bg-green-50/60 text-[#258200]"
                              : "text-gray-600 hover:bg-gray-50/50 hover:text-gray-900"
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[10px] shrink-0 overflow-hidden ${
                            isSelected 
                              ? "bg-[#4CAF50]/15 text-[#258200]" 
                              : "bg-gray-100 text-gray-500"
                          }`}>
                            {comp.logoUrl && !companyImageErrors[comp.id] ? (
                              <Image
                                src={comp.logoUrl}
                                alt={comp.name}
                                width={24}
                                height={24}
                                className="w-full h-full object-cover"
                                onError={() => {
                                  setCompanyImageErrors((prev) => ({ ...prev, [comp.id]: true }));
                                }}
                              />
                            ) : (
                              compInitials
                            )}
                          </div>
                          <span className="truncate flex-1">{comp.name}</span>
                          {isSwitchingThisCompany ? (
                            <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-[#258200]" />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>

                  <div className="border-t border-gray-50 mt-1 pt-1.5 px-1">
                    <Link
                      href="/dashboard/user/setting?tab=company"
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full flex items-center justify-center gap-1 py-1.5 rounded-lg border border-dashed border-gray-250 hover:border-[#4CAF50] text-[10px] font-bold text-gray-505 hover:text-[#4CAF50] transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Manage Companies</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            )}

            {/* Sidebar Section Title */}
            <div className="px-6 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Main
            </div>

            {/* Menu Items */}
            <nav className="px-3 space-y-1 mt-1">
              {menuToRender.map((item) => {
                const isActive = selectedKey === item.key;
                return (
                  <Link
                    key={item.key}
                    href={item.key}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all border-l-[5px] ${
                      isActive
                        ? "bg-green-50/80 text-[#258200] hover:text-[#258200] border-l-[#258200]"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 border-l-transparent"
                    }`}
                  >
                    <span className={isActive ? "text-[#258200]" : "text-gray-400"}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sider Bottom Logout button */}
          <div className="px-4">
            <button
              onClick={handleLogoutClick}
              className="w-full flex cursor-pointer items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-[#FF3B30] bg-[#FFEBEB] hover:bg-[#FDD8D8] transition-all"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </Sider>

      {/* Main Layout Area */}
      <Layout className="flex-1 flex flex-col h-full bg-[#F8F9FA] relative">
        {/* Mobile Sidebar Backdrop Overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-40 lg:hidden transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Header Bar */}
        <Header className="bg-white px-6 py-4 h-16 border-b border-gray-100 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-gray-900 truncate">
            {pageTitle}
          </h2>

          <div className="flex items-center gap-3">
            {/* Refresh Button */}
            <button
              onClick={() => window.location.reload()}
              className="flex cursor-pointer items-center gap-1.5 px-2.5 sm:px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-500 transition-colors"
            >
              <span className="hidden sm:inline">Refresh</span>
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {pathname.includes("/admin") && (
              <span className="hidden sm:inline text-sm font-semibold text-gray-400 mr-1 select-none">
                Admin
              </span>
            )}

            {/* User Profile Avatar */}
            <Dropdown menu={{ items: profileMenuItems }} placement="bottomRight" arrow>
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer border border-gray-100 shadow-sm shrink-0">
                {avatarUrl && !avatarError ? (
                  <Image
                    src={avatarUrl}
                    alt="avatar"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <span className="text-xs font-bold text-gray-700 select-none">
                    {fallbackInitial}
                  </span>
                )}
              </div>
            </Dropdown>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden block cursor-pointer text-xl text-gray-700 hover:bg-gray-50 p-1 rounded-lg focus:outline-none"
              aria-label="Toggle menu"
            >
              ☰
            </button>
          </div>
        </Header>

        {/* Content Panel */}
        <Content
          className="overflow-y-auto p-6"
          onClick={() => setMobileOpen(false)}
        >
          {children}
        </Content>
      </Layout>

      {/* Log Out Confirmation Dialog */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-9999 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-[420px] p-10 flex flex-col items-center text-center shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="text-[#FF3B30] mb-6">
              <Power className="w-20 h-20 stroke-[1.2]" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Log Out</h3>
            <p className="text-sm text-gray-400 font-semibold mb-8">
              Are you sure you want to logout?
            </p>
            <div className="flex gap-4 w-full">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-3 px-6 border border-[#FF3B30] hover:bg-red-50/20 text-[#FF3B30] font-extrabold rounded-full text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                disabled={isLoggingOut}
                style={{ background: "var(--Gradian-Colur, linear-gradient(180deg, #258200 0%, #58B500 100%))" }}
                className="flex-1 py-3 px-6 hover:brightness-110 text-white font-extrabold rounded-full text-sm transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoggingOut ? "Logging Out..." : "Log Out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminLayout;
