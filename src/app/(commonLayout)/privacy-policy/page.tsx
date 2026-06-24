"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#f8f9fa] min-h-screen py-16 sm:py-24 select-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-gray-950 transition-colors mb-8 select-none"
        >
          <ChevronLeft className="w-4.5 h-4.5 text-[#D13900] stroke-[2.5]" />
          <span>Back to Home</span>
        </Link>

        {/* Main Content Card */}
        <div className="bg-white rounded-[32px] p-8 sm:p-12 md:p-16 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
          {/* Header */}
          <div className="mb-12 pb-6 border-b border-gray-100">
            <h1 className="text-3xl sm:text-[40px] font-extrabold text-gray-900 tracking-tight mb-4 poppins">
              Privacy Policy
            </h1>
            <p className="text-sm sm:text-base text-gray-500 leading-relaxed font-medium">
              Your privacy matters to us. Learn how we collect, use, and protect your information.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-8 text-gray-600 leading-relaxed text-sm sm:text-base">
            
            {/* Introduction */}
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-950 mb-3 poppins">
                Introduction
              </h2>
              <p className="font-normal text-gray-500">
                We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and safeguard data when you use our platform.
              </p>
            </div>

            {/* 1. Information We Collect */}
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-950 mb-3 poppins">
                1. Information We Collect
              </h2>
              <p className="font-normal text-gray-500 mb-4">
                We may collect:
              </p>
              <ul className="space-y-2 pl-5 list-disc marker:text-[#D13900] font-normal text-gray-500">
                <li>Name and contact information</li>
                <li>Company information</li>
                <li>User account details</li>
                <li>Driver performance data</li>
                <li>Uploaded Excel or CSV files</li>
                <li>Login and activity records</li>
              </ul>
            </div>

            {/* 2. How We Use Your Information */}
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-950 mb-3 poppins">
                2. How We Use Your Information
              </h2>
              <p className="font-normal text-gray-500 mb-4">
                We use your information to:
              </p>
              <ul className="space-y-2 pl-5 list-disc marker:text-[#D13900] font-normal text-gray-500">
                <li>Provide and maintain the platform</li>
                <li>Calculate performance scores and rankings</li>
                <li>Generate reports and analytics</li>
                <li>Manage competitions and leaderboards</li>
                <li>Improve platform functionality</li>
                <li>Communicate important updates and notifications</li>
              </ul>
            </div>

            {/* 3. Data Security */}
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-950 mb-3 poppins">
                3. Data Security
              </h2>
              <p className="font-normal text-gray-500 mb-3">
                We do not sell, rent, or trade personal information to third parties.
              </p>
              <p className="font-normal text-gray-500 mb-4">
                Information may only be shared:
              </p>
              <ul className="space-y-2 pl-5 list-disc marker:text-[#D13900] font-normal text-gray-500">
                <li>With authorized users within your organization</li>
                <li>When required by law</li>
                <li>With trusted service providers supporting platform operations</li>
              </ul>
            </div>

            {/* 4. Data Storage */}
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-950 mb-3 poppins">
                4. Data Storage
              </h2>
              <p className="font-normal text-gray-500">
                All uploaded files and performance data are stored securely and are accessible only to authorized users associated with the respective company account.
              </p>
            </div>

            {/* 5. User Rights */}
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-950 mb-3 poppins">
                5. User Rights
              </h2>
              <p className="font-normal text-gray-500 mb-4">
                Users may have the right to:
              </p>
              <ul className="space-y-2 pl-5 list-disc marker:text-[#D13900] font-normal text-gray-500">
                <li>Access their personal information</li>
                <li>Request corrections to inaccurate data</li>
                <li>Request deletion of personal data where applicable</li>
                <li>Update account information</li>
              </ul>
            </div>

            {/* 6. Cookies and Analytics */}
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-950 mb-3 poppins">
                6. Cookies and Analytics
              </h2>
              <p className="font-normal text-gray-500">
                The platform may use cookies and similar technologies to improve user experience, monitor performance, and enhance security.
              </p>
            </div>

            {/* 7. Data Retention */}
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-950 mb-3 poppins">
                7. Data Retention
              </h2>
              <p className="font-normal text-gray-500">
                We retain information only for as long as necessary to provide services, comply with legal obligations, and support legitimate business purposes.
              </p>
            </div>

            {/* 8. Changes to This Policy */}
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-950 mb-3 poppins">
                8. Changes to This Policy
              </h2>
              <p className="font-normal text-gray-500">
                We may update this Privacy Policy periodically. Any changes will be posted on this page with an updated effective date.
              </p>
            </div>

            {/* 9. Contact Us */}
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-950 mb-3 poppins">
                9. Contact Us
              </h2>
              <p className="font-normal text-gray-500 mb-3">
                If you have any questions regarding this Privacy Policy, please contact us at:
              </p>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 inline-block font-normal text-gray-500 space-y-1 text-xs sm:text-sm">
                <div>
                  <strong className="text-gray-700">Email:</strong>{" "}
                  <a href="mailto:support@yourcompany.com" className="text-[#D13900] hover:underline font-bold">
                    support@yourcompany.com
                  </a>
                </div>
                <div>
                  <strong className="text-gray-700">Website:</strong>{" "}
                  <a href="https://www.yourcompany.com" target="_blank" rel="noopener noreferrer" className="text-[#D13900] hover:underline font-bold">
                    www.yourcompany.com
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
