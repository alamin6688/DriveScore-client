"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Linkedin, Instagram, Gauge } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";

const socialLinks = [
  { icon: Facebook, href: "#" },
  { icon: FaXTwitter, href: "#" },
  { icon: Linkedin, href: "#" },
  { icon: Instagram, href: "#" },
];

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "How it Works", href: "/#how-it-works" },
  { name: "Contact Us", href: "/#contact" },
];

const features = [
  { name: "Live Leaderboard", href: "#" },
  { name: "Custom Metric Weights", href: "#" },
  { name: "Weekly Competition Cycle", href: "#" },
  { name: "Data Isolation", href: "#" },
  { name: "Performance History", href: "#" },
];

export default function Footer() {
  return (
    <footer className="max-w-7xl mx-auto bg-[#181922] select-text">
      <div className=" text-white rounded-[32px]  shadow-xl">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              {/* Scorecard League Brand Logo */}
              <Link href="/" className="flex items-center gap-2 mb-6 hover:opacity-90 transition-opacity">
                <div className="w-10 h-10 rounded-xl bg-[#D13900] flex items-center justify-center text-white">
                  <Gauge className="w-5 h-5 stroke-2" />
                </div>
                <span className="text-xl font-bold tracking-tight text-[#D13900] poppins">
                  Scorecard League
                </span>
              </Link>
              <p className="text-sm text-[#A0A3A6] leading-relaxed font-normal max-w-sm">
                Upload your Excel, let us calculate scores, watch your team compete every week on a live leaderboard.
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-8">
              {socialLinks.map(({ icon: Icon, href }, i) => (
                <Link
                  key={i}
                  href={href}
                  className="w-8 h-8 rounded-lg bg-[#242633] hover:bg-[#323547] flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-3 lg:pl-8">
            <h3 className="text-sm font-bold text-white mb-6 tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {quickLinks.map(({ name, href }) => (
                <li key={name}>
                  <Link
                    href={href}
                    className="text-sm text-[#A0A3A6] hover:text-white font-medium transition-colors duration-200"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features Column */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold text-white mb-6 tracking-wide">
              Features
            </h3>
            <ul className="space-y-4">
              {features.map(({ name, href }) => (
                <li key={name}>
                  <Link
                    href={href}
                    className="text-sm text-[#A0A3A6] hover:text-white font-medium transition-colors duration-200"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-white mb-6 tracking-wide">
              Contact Us
            </h3>
            <div>
              <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wider select-none">
                Email
              </h4>
              <a
                href="mailto:hello@userinfo.com"
                className="text-sm text-[#A0A3A6] hover:text-white font-medium transition-colors duration-200"
              >
                hello@userinfo.com
              </a>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-[#242633] mb-8" />

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-[#A0A3A6] font-normal">
          <div>
            © 2026 Drive Rank. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy-policy"
              className="hover:text-white underline underline-offset-4 decoration-[#A0A3A6]/40 hover:decoration-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-white underline underline-offset-4 decoration-[#A0A3A6]/40 hover:decoration-white transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
