"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function TermsPage() {
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
              Terms & Conditions
            </h1>
            <p className="text-sm sm:text-base text-gray-500 leading-relaxed font-medium">
              Your privacy matters to us. Learn how we collect, use, and protect your information.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-8 text-gray-600 leading-relaxed text-sm sm:text-base">
            
            {/* Introduction */}
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-955 mb-3 poppins">
                Introduction
              </h2>
              <p className="font-normal text-gray-500">
                By accessing or using the platform, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you should not use the platform.
              </p>
            </div>

            {/* Platform Services */}
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-955 mb-3 poppins">
                Platform Services
              </h2>
              <p className="font-normal text-gray-500 mb-4">
                The platform provides tools for:
              </p>
              <ul className="space-y-2 pl-5 list-disc marker:text-[#D13900] font-normal text-gray-500">
                <li>Uploading performance data</li>
                <li>Automated score calculations</li>
                <li>Driver rankings and leaderboards</li>
                <li>Competition management</li>
                <li>Analytics and reporting</li>
              </ul>
              <p className="font-normal text-gray-500 mt-4">
                We reserve the right to modify, suspend, or discontinue any feature at any time.
              </p>
            </div>

            {/* User Accounts */}
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-955 mb-3 poppins">
                User Accounts
              </h2>
              <p className="font-normal text-gray-500 mb-4">
                Users are responsible for:
              </p>
              <ul className="space-y-2 pl-5 list-disc marker:text-[#D13900] font-normal text-gray-500">
                <li>Maintaining the confidentiality of login credentials</li>
                <li>Ensuring account information is accurate</li>
                <li>All activities performed under their account</li>
              </ul>
              <p className="font-normal text-gray-500 mt-4">
                You must immediately notify us of any unauthorized use of your account.
              </p>
            </div>

            {/* Company Responsibilities */}
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-955 mb-3 poppins">
                Company Responsibilities
              </h2>
              <p className="font-normal text-gray-500 mb-4">
                Companies are responsible for:
              </p>
              <ul className="space-y-2 pl-5 list-disc marker:text-[#D13900] font-normal text-gray-500">
                <li>Uploading accurate performance data</li>
                <li>Managing authorized users</li>
                <li>Maintaining compliance with applicable laws and regulations</li>
                <li>Ensuring proper use of the platform</li>
              </ul>
            </div>

            {/* Data Accuracy */}
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-955 mb-3 poppins">
                Data Accuracy
              </h2>
              <p className="font-normal text-gray-500 mb-3">
                Performance scores, rankings, and reports are generated based on data provided by users.
              </p>
              <p className="font-normal text-gray-500 mb-4">
                We are not responsible for inaccuracies resulting from:
              </p>
              <ul className="space-y-2 pl-5 list-disc marker:text-[#D13900] font-normal text-gray-500">
                <li>Incorrect uploads</li>
                <li>Missing information</li>
                <li>Improper configuration of scoring metrics</li>
                <li>Data entry errors</li>
              </ul>
            </div>

            {/* Intellectual Property */}
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-955 mb-3 poppins">
                Intellectual Property
              </h2>
              <p className="font-normal text-gray-500 mb-3">
                All platform content, software, designs, logos, and features remain the property of the platform owner and are protected by applicable intellectual property laws.
              </p>
              <p className="font-normal text-gray-500">
                Users may not copy, distribute, modify, or reproduce platform content without written permission.
              </p>
            </div>

            {/* Acceptable Use */}
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-955 mb-3 poppins">
                Acceptable Use
              </h2>
              <p className="font-normal text-gray-500 mb-4">
                Users agree not to:
              </p>
              <ul className="space-y-2 pl-5 list-disc marker:text-[#D13900] font-normal text-gray-500">
                <li>Attempt unauthorized access to the platform</li>
                <li>Upload malicious files or software</li>
                <li>Disrupt platform operations</li>
                <li>Use the platform for unlawful activities</li>
                <li>Share access credentials with unauthorized individuals</li>
              </ul>
            </div>

            {/* Service Availability */}
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-955 mb-3 poppins">
                Service Availability
              </h2>
              <p className="font-normal text-gray-500 mb-3">
                While we strive to maintain uninterrupted service, we do not guarantee that the platform will always be available, secure, or error-free.
              </p>
              <p className="font-normal text-gray-500">
                Scheduled maintenance and unforeseen technical issues may affect availability.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-955 mb-3 poppins">
                Limitation of Liability
              </h2>
              <p className="font-normal text-gray-500 mb-4">
                To the maximum extent permitted by law:
              </p>
              <ul className="space-y-2 pl-5 list-disc marker:text-[#D13900] font-normal text-gray-500">
                <li>We are not liable for indirect, incidental, or consequential damages.</li>
                <li>We are not responsible for loss of business, profits, or data resulting from use of the platform.</li>
                <li>Total liability shall not exceed the amount paid for platform services during the preceding twelve months.</li>
              </ul>
            </div>

            {/* Account Suspension */}
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-955 mb-3 poppins">
                Account Suspension
              </h2>
              <p className="font-normal text-gray-500 mb-4">
                We reserve the right to suspend or terminate accounts that:
              </p>
              <ul className="space-y-2 pl-5 list-disc marker:text-[#D13900] font-normal text-gray-500">
                <li>Violate these Terms & Conditions</li>
                <li>Engage in fraudulent activities</li>
                <li>Misuse the platform or its services</li>
              </ul>
            </div>

            {/* Termination */}
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-955 mb-3 poppins">
                Termination
              </h2>
              <p className="font-normal text-gray-500">
                Users may discontinue use of the platform at any time. Upon termination, access to platform services may be restricted or removed in accordance with applicable policies.
              </p>
            </div>

            {/* Changes to Terms */}
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-955 mb-3 poppins">
                Changes to Terms
              </h2>
              <p className="font-normal text-gray-500">
                We may update these Terms & Conditions periodically. Continued use of the platform after updates constitutes acceptance of the revised terms.
              </p>
            </div>

            {/* Governing Law */}
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-955 mb-3 poppins">
                Governing Law
              </h2>
              <p className="font-normal text-gray-500">
                These Terms & Conditions shall be governed by and interpreted in accordance with applicable laws and regulations.
              </p>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-955 mb-3 poppins">
                Contact Information
              </h2>
              <p className="font-normal text-gray-500 mb-3">
                For questions regarding these Terms & Conditions, please contact:
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
