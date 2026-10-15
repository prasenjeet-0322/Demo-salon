"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, MapPin, Clock, Phone, Mail, ShieldCheck, Share2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#121214] text-zinc-300 pt-16 pb-12 border-t border-[#c59c47]/20 relative overflow-hidden">
      {/* Decorative luxury radial background */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#c59c47]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#f7e0d8]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-zinc-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#9e7529] via-[#c59c47] to-[#e8d29b] flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-widest uppercase text-white">
                DEMO
              </span>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              An oasis of modern elegance. We blend European precision with holistic wellness to deliver couture hair styling, restorative clinical facials, and unforgettable bridal transformations.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-[#c59c47] hover:text-white flex items-center justify-center text-zinc-400 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-[#c59c47] hover:text-white flex items-center justify-center text-zinc-400 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-[#c59c47] hover:text-white flex items-center justify-center text-zinc-400 transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-serif text-base font-semibold tracking-wide border-b border-[#c59c47]/30 pb-2 inline-block">
              Salon Atelier
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/" className="hover:text-[#c59c47] transition-colors">
                  Home Sanctuary
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#c59c47] transition-colors">
                  Services Menu
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-[#c59c47] transition-colors">
                  Book an Appointment
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#c59c47] transition-colors">
                  Contact & Directions
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-[#c59c47] hover:underline pt-1 font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Services categories */}
          <div className="space-y-3">
            <h4 className="text-white font-serif text-base font-semibold tracking-wide border-b border-[#c59c47]/30 pb-2 inline-block">
              Experiences
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/services?category=Hair" className="hover:text-[#c59c47] transition-colors">
                  Couture Hair & Spa
                </Link>
              </li>
              <li>
                <Link href="/services?category=Skin" className="hover:text-[#c59c47] transition-colors">
                  Hydra & Gold Facials
                </Link>
              </li>
              <li>
                <Link href="/services?category=Nails" className="hover:text-[#c59c47] transition-colors">
                  Artisanal Nails & Pedicures
                </Link>
              </li>
              <li>
                <Link href="/services?category=Bridal%20%26%20Makeup" className="hover:text-[#c59c47] transition-colors">
                  Bridal & Gala Makeup
                </Link>
              </li>
              <li>
                <Link href="/services?category=Grooming" className="hover:text-[#c59c47] transition-colors">
                  Gentlemen&apos;s Grooming
                </Link>
              </li>
            </ul>
          </div>

          {/* Visit & Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-serif text-base font-semibold tracking-wide border-b border-[#c59c47]/30 pb-2 inline-block">
              Sanctuary Hours
            </h4>
            <div className="space-y-3 text-xs text-zinc-400">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#c59c47] shrink-0 mt-0.5" />
                <div>
                  <p className="text-zinc-200 font-medium">Monday – Sunday</p>
                  <p>10:00 AM – 08:00 PM</p>
                  <p className="text-zinc-500 text-[11px] mt-0.5">Appointments till 7:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#c59c47] shrink-0 mt-0.5" />
                <div>
                  <p className="text-zinc-200 font-medium">The Pavilion Luxury Mall</p>
                  <p>Level 2, 100ft Road, Indiranagar</p>
                  <p>Bengaluru, Karnataka 560038</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <Phone className="w-4 h-4 text-[#c59c47] shrink-0" />
                <a href="tel:+919876543210" className="text-zinc-200 hover:text-[#c59c47]">
                  +91 98765 43210
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#c59c47] shrink-0" />
                <a href="mailto:concierge@demosalon.com" className="text-zinc-300 hover:text-[#c59c47]">
                  concierge@demosalon.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} DEMO Luxury Salon & Spa. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-zinc-400 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Demo Mode: Browser Storage Active
            </span>
            <Link href="/admin" className="hover:text-zinc-300 transition-colors">
              Admin Login (Demo)
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
