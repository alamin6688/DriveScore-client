"use client";

import React, { useState } from "react";
import { Mail, Phone, CheckCircle2 } from "lucide-react";
import { useCreateContactMutation } from "@/service/contact/contactApi";
import { appAlert } from "@/utils/appAlert";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

export default function ContactUsSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [createContact] = useCreateContactMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      appAlert.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill out all fields.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createContact({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      }).unwrap();
      setSubmitSuccess(true);
    } catch (err: unknown) {
      appAlert.fire({
        icon: "error",
        title: "Message Failed",
        text: getApiErrorMessage(err, "Failed to send message."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-white py-24 relative select-text">
      <div className="max-w-7xl mx-auto px-4">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-2xl border-b-2 border-b-red-500/60  bg-white text-xs sm:text-sm font-semibold text-gray-800 shadow-sm select-none">
            <span>Get In Touch</span>
          </div>
        </div>

        {/* Heading & Subtitle */}
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-normal text-gray-900 leading-tight tracking-wide mb-5 poppins">
            Let's Talk Winning
          </h2>
          <p className="text-[13px] sm:text-sm md:text-[15px] text-gray-500/90 leading-relaxed font-medium max-w-2xl mx-auto px-2">
            Have questions? Our team will help you set up your first competition
            and get drivers ranked within the hour.
          </p>
        </div>

        {/* Contact Information Buttons Row */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
          <a
            href="mailto:hello@scorecardleague.com"
            className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl border border-black bg-white text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm select-none"
          >
            <Mail className="w-4 h-4 text-gray-400" />
            <span>Email : [EMAIL_ADDRESS]</span>
          </a>
          <a
            href="tel:27874387637"
            className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl border border-black bg-white text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm select-none"
          >
            <Phone className="w-4 h-4 text-gray-400" />
            <span>Contact : 27874387637</span>
          </a>
        </div>

        {/* Form Container Card */}
        <div className="max-w-3xl mx-auto bg-[#F3F4F6] rounded-[32px] p-8 sm:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.01)]">
          {submitSuccess ? (
            <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mb-6 text-green-600 shadow-sm">
                <CheckCircle2 className="w-10 h-10 stroke-[1.75]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Message Sent!
              </h3>
              <p className="text-gray-500 max-w-md mb-8 text-sm sm:text-base leading-relaxed">
                Thank you for getting in touch,{" "}
                <span className="font-semibold text-gray-800">
                  {formData.name}
                </span>
                . We have received your message and will respond within 24
                hours.
              </p>
              <button
                onClick={() => {
                  setSubmitSuccess(false);
                  setFormData({ name: "", email: "", message: "" });
                }}
                className="px-8 py-3 rounded-full bg-white hover:bg-gray-50 text-gray-700 font-bold border border-gray-200 transition-all duration-200 text-sm shadow-sm"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Input */}
                <div className="flex flex-col gap-2">
                  <label
                    className="text-[13px] font-bold text-gray-505 select-none"
                    htmlFor="name"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Marcus Ren"
                    required
                    className="w-full px-5 py-3.5 rounded-xl border-1 bg-white text-gray-900 font-medium text-sm focus:outline-none focus:border-red-500/30 focus:ring-1 focus:ring-red-500/10 transition-all placeholder-gray-400"
                  />
                </div>

                {/* Email Input */}
                <div className="flex flex-col gap-2">
                  <label
                    className="text-[13px] font-bold text-gray-550 select-none"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="marcus@apexracing.io"
                    required
                    className="w-full px-5 py-3.5 rounded-xl border border-transparent bg-white text-gray-900 font-medium text-sm focus:outline-none focus:border-red-500/30 focus:ring-1 focus:ring-red-500/10 transition-all placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Message Textarea */}
              <div className="flex flex-col gap-2">
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell us about your racing series, number of drivers, and how we can help.."
                  required
                  className="w-full px-5 py-4 rounded-2xl border border-transparent bg-white text-gray-900 font-medium text-sm focus:outline-none focus:border-red-500/30 focus:ring-1 focus:ring-red-500/10 transition-all placeholder-gray-400 resize-none leading-relaxed"
                />
              </div>

              {/* Send Button */}
              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 bg-[#D13900] hover:bg-[#b23000] text-white font-bold text-sm rounded-[14px] flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                >
                  <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                  {!isSubmitting && <span className="text-base">→</span>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
