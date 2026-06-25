/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/lib/utils";
import { DownOutlined, HeartFilled, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Avatar, Drawer, Dropdown, Typography } from "antd";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IoClose, IoMenu } from "react-icons/io5";
import logo from "@/assets/logo/logo.svg";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store"; // 👈 adjust path if needed
import { logout } from "@/redux/features/auth"; // 👈 your logout action
import {
  getProfileAvatar,
  getProfileName,
  useGetProfileDataQuery,
} from "@/service/profile/profileApi";
import { useLogoutMutation } from "@/service/auth/authApi";
import { getDashboardPathByRole, normalizeRole } from "@/utils/roles";

const { Text } = Typography;

export default function Navbar() {
  const [isSticky, setIsSticky] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // 🔑 Get auth state from Redux
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const role = normalizeRole(user?.role);


  const dispatch = useDispatch();
  const [logoutUser] = useLogoutMutation();

  const handleLogOut = async () => {
    try {
      await logoutUser().unwrap();
    } catch {
      // If the server session is already expired, still clear the frontend session.
    } finally {
      setOpen(false);
      dispatch(logout());
    }
  }
  const isAuthenticated = !!accessToken && !!user;
  
  // 👤 Get full profile data for avatar and name
  const { data: profileResponse } = useGetProfileDataQuery(undefined, { skip: !isAuthenticated });
  
  const avatarUrl = getProfileAvatar(profileResponse?.data).trim() || null;
  const displayName = getProfileName(profileResponse?.data) || user?.name || user?.email?.split("@")[0] || "User";
  const roleName = normalizeRole(profileResponse?.data?.role || user?.role);

  const fallbackInitial = (displayName?.[0] || user?.email?.[0] || "U").toUpperCase();

  // ===== Navigation Links =====
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#how-it-works", label: "How it Works" },
    { href: "/#contact", label: "Contact Us" },
  ];

  const [activeSection, setActiveSection] = useState("home");

  const isActive = (href: string) => {
    if (pathname === "/") {
      if (href === "/") {
        return activeSection === "home";
      }
      const hash = href.split("#")[1];
      return activeSection === hash;
    }
    return pathname === href;
  };

  const avatarMenuItems: MenuProps["items"] = [
    ...(role
      ? [
        {
          key: "dashboard",
          label: (
            <Link href={getDashboardPathByRole(role)} className="block w-full">
              <Text strong>Dashboard</Text>
            </Link>
          ),
        },
      ]
      : []),
    { type: "divider" },
    {
      key: "logout",
      label: (
        <Text
          onClick={() => handleLogOut()}
          className="w-full block text-red-600 hover:text-red-800 font-bold"
          strong
        >
          Log Out
        </Text>
      ),
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 20);
      
      if (pathname !== "/") return;

      const sections = ["demo", "how-it-works", "pricing", "contact"];
      
      // Near top of page
      if (window.scrollY < 100) {
        setActiveSection("home");
        return;
      }

      // Near bottom of page
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80) {
        setActiveSection("contact");
        return;
      }

      let currentActive = "home";
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            currentActive = sectionId;
            break;
          }
        }
      }
      setActiveSection(currentActive);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on load
    handleScroll();

    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const sections = ["demo", "how-it-works", "pricing", "contact"];
      if (sections.includes(hash)) {
        setActiveSection(hash);
      } else if (!hash) {
        setActiveSection("home");
      }
    };
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [pathname]);

  // ===== Mobile Drawer =====
  const MobileDrawer = () => {
    return (
      <Drawer
        title={
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logo}
              width={32}
              height={32}
              alt="logo"
              className="h-8 w-auto"
            />
            <span className="font-extrabold text-lg text-[#D13900] tracking-tight">Scorecard League</span>
          </Link>
        }
        placement="left"
        width={280}
        open={open}
        onClose={() => setOpen(false)}
        closeIcon={false}
        extra={
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Close menu"
          >
            <IoClose size={20} className="text-gray-700" />
          </button>
        }
        styles={{
          body: { padding: 0, display: "flex", flexDirection: "column", height: "100%" },
          header: {
            borderBottom: "1px solid #e5e7eb",
            backgroundColor: "#fff",
          },
          content: { backgroundColor: "#ffffff" },
        }}
      >
        {/* Main Nav */}
        <nav className="px-4 py-6">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 border-l-[5px] ${isActive(link.href)
                  ? "bg-orange-50 text-[#D13900] border-l-[#D13900]"
                  : "text-gray-700 hover:bg-gray-55 hover:text-[#D13900] border-l-transparent"
                  }`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="mt-auto border-t border-gray-200 bg-gray-50 px-4 py-3">
          <div className="space-y-2">
            {isAuthenticated ? (
              <>
                {role === "USER" && (
                  <>
                    <Link
                      href="/dashboard/user/property-list/add-property"
                      className="flex items-center gap-3 w-full px-4 py-2.5 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-800 font-medium hover:bg-gray-55 hover:border-[#D13900] hover:text-[#D13900] transition-all text-sm"
                      onClick={() => setOpen(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      <span>Add Listing</span>
                    </Link>
                    <div className="border-t border-gray-200 my-2"></div>
                  </>
                )}

                <Dropdown menu={{ items: avatarMenuItems }} trigger={["click"]} arrow>
                  <div className="flex items-center gap-2 w-full h-20 px-3 bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-55 transition-colors">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-[#D13900] flex items-center justify-center border-2 border-white shadow-sm shrink-0">
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt="avatar"
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold text-white">
                          {fallbackInitial}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate leading-tight">
                        {displayName}
                      </p>
                      <p className="text-xs text-gray-500 leading-tight">
                        {roleName}
                      </p>
                    </div>
                    <DownOutlined className="text-gray-400 text-xs shrink-0" />
                  </div>
                </Dropdown>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  className="w-full px-4 py-3 bg-[#D13900] hover:bg-[#b23000] text-white font-bold rounded-full text-center hover:brightness-110 transition-all block"
                  onClick={() => setOpen(false)}
                >
                  Log In &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>
      </Drawer>
    );
  };

  return (
    <div className="w-full">
      {/* Sticky Navbar */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 border-b border-red-100",
          isSticky
            ? "bg-white/90 backdrop-blur-lg shadow-sm"
            : "bg-white",
        )}
      >
        {/* Desktop Navbar */}
        <div className="hidden lg:flex max-w-7xl mx-auto py-3 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src={logo}
              width={34}
              height={34}
              alt="DriveScore"
              className="h-8.5 w-auto"
            />
            <span className="font-extrabold text-[22px] text-[#D13900] tracking-tight poppins">
              Scorecard League
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm md:text-[15px] font-semibold transition-all duration-200 relative pb-1 border-b-2 ${isActive(link.href)
                  ? "text-[#D13900] border-[#D13900]"
                  : "text-gray-600 hover:text-[#D13900] border-transparent"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Dropdown menu={{ items: avatarMenuItems }} trigger={["click"]}>
                <div className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-white transition-colors border border-[#D4D4D4]">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-[#D13900] flex items-center justify-center shrink-0">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt="avatar"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold text-white">
                        {fallbackInitial}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-800 hidden md:inline">
                    {displayName}
                  </span>
                  <DownOutlined className="text-xs text-gray-500" />
                </div>
              </Dropdown>
            ) : (
              <Link
                href="/login"
                className="text-sm px-6 py-2.5 rounded-full bg-[#D13900] hover:bg-[#b23000] text-white font-bold transition-all duration-200 shadow-sm flex items-center gap-1.5"
              >
                Log In <span className="text-base font-semibold leading-none">→</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Header */}
        <div className="flex lg:hidden items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logo}
              width={28}
              height={28}
              alt="logo"
              className="h-7 w-auto"
            />
            <span className="font-extrabold text-lg text-[#D13900] tracking-tight">Scorecard League</span>
          </Link>
          <button
            onClick={() => setOpen(true)}
            className="p-2"
            aria-label="Open menu"
          >
            <IoMenu size={24} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer />
    </div>
  );
}
