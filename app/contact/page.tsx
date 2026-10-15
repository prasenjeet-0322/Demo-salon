"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  MapPin,
  Clock,
  Phone,
  Mail,
  MessageCircle,
  Car,
  Accessibility,
  Send,
  CheckCircle2,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useToast } from "@/components/Toast";

export default function ContactPage() {
  const toast = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("General Inquiry");
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      toast.error("Incomplete Form", "Please fill in all required fields.");
      return;
    }

    setIsSent(true);
    toast.success("Message Dispatched", "Our salon concierge will reach out to you shortly.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        {/* Header */}
        <div className="bg-cream-mesh border-b border-[#eaddd0]/80 py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#e3cc94] text-xs font-semibold uppercase tracking-widest text-[#ab7f37] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Connect With Concierge</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-zinc-900 tracking-tight mb-3">
              Contact & Sanctuary Visit
            </h1>
            <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
              Have questions regarding bespoke bridal packages, customized haircare programs, or private event bookings? We are here to assist.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Contact Information Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-sm space-y-6">
                <h2 className="font-serif text-2xl font-bold text-zinc-900">
                  Salon Atelier Location
                </h2>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#c59c47]/15 flex items-center justify-center text-[#ab7f37] shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-zinc-900 block font-serif">Atelier Address</strong>
                      <p className="text-zinc-600 text-xs sm:text-sm mt-0.5">
                        Level 2, The Pavilion Luxury Mall,
                        <br />
                        100ft Road, Indiranagar,
                        <br />
                        Bengaluru, Karnataka 560038
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#c59c47]/15 flex items-center justify-center text-[#ab7f37] shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-zinc-900 block font-serif">Opening Hours</strong>
                      <p className="text-zinc-600 text-xs sm:text-sm mt-0.5">
                        Monday – Sunday: 10:00 AM – 08:00 PM
                        <br />
                        <span className="text-[#ab7f37] text-xs font-medium">
                          Appointments till 7:00 PM
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#c59c47]/15 flex items-center justify-center text-[#ab7f37] shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-zinc-900 block font-serif">Direct Hotline</strong>
                      <a
                        href="tel:+919876543210"
                        className="text-zinc-600 hover:text-[#ab7f37] text-xs sm:text-sm block mt-0.5"
                      >
                        +91 98765 43210
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#c59c47]/15 flex items-center justify-center text-[#ab7f37] shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-zinc-900 block font-serif">Concierge Email</strong>
                      <a
                        href="mailto:concierge@demosalon.com"
                        className="text-zinc-600 hover:text-[#ab7f37] text-xs sm:text-sm block mt-0.5"
                      >
                        concierge@demosalon.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Direct WhatsApp Callout */}
                <div className="pt-2">
                  <a
                    href="https://wa.me/919876543210?text=Hello%20DEMO%20Salon,%20I%20would%20like%20to%20inquire%20about%20a%20booking"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat Directly on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Arrival Amenities */}
              <div className="bg-[#FAF5EB] p-5 rounded-2xl border border-[#eaddd0] space-y-3 text-xs text-zinc-700">
                <div className="flex items-center gap-2 font-bold text-zinc-900 uppercase tracking-wider">
                  <Car className="w-4 h-4 text-[#ab7f37]" />
                  <span>Complimentary Valet Parking</span>
                </div>
                <p className="text-zinc-600 leading-relaxed">
                  Dedicated valet drop-off is available at the Pavilion East Entrance. Present your DEMO appointment text for validation.
                </p>
                <div className="flex items-center gap-2 font-bold text-zinc-900 uppercase tracking-wider pt-2 border-t border-zinc-200/60">
                  <Accessibility className="w-4 h-4 text-[#ab7f37]" />
                  <span>Wheelchair Accessible & Private Elevators</span>
                </div>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200/80 shadow-sm space-y-6">
                <div className="border-b border-zinc-100 pb-4">
                  <h2 className="font-serif text-2xl font-bold text-zinc-900">
                    Send Us an Inquiry
                  </h2>
                  <p className="text-zinc-500 text-xs sm:text-sm mt-1">
                    Please leave your message and our senior front-desk director will get back to you within 2 business hours.
                  </p>
                </div>

                {isSent ? (
                  <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h3 className="font-serif text-xl font-bold text-zinc-900">
                      Thank You for Reaching Out
                    </h3>
                    <p className="text-xs text-zinc-600 max-w-sm mx-auto">
                      Your inquiry has been logged. Our concierge manager will call or message you shortly.
                    </p>
                    <button
                      onClick={() => {
                        setIsSent(false);
                        setMessage("");
                      }}
                      className="mt-3 px-5 py-2 rounded-full text-xs font-semibold bg-zinc-900 text-white"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Aditi Rao"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#c59c47]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 9876543210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#c59c47]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                        Inquiry Topic
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#c59c47]"
                      >
                        <option>General Inquiry</option>
                        <option>Bespoke Bridal Packages</option>
                        <option>Hair Color & Balayage Consultation</option>
                        <option>VIP Suite Booking</option>
                        <option>Feedback & Suggestions</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                        Message or Consultation Requirements *
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Tell us what you are looking for..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#c59c47]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest bg-zinc-900 hover:bg-[#ab7f37] text-white transition-colors flex items-center justify-center gap-2 shadow-md"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
