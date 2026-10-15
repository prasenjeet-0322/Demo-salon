"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Calendar, Menu, X, Phone, ShieldCheck } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Book Now", href: "/book" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#FAF8F5]/90 backdrop-blur-md shadow-sm border-b border-[#e8dfd3]/80 py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-zinc-900 transition-transform hover:scale-[1.01]"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#9e7529] via-[#c59c47] to-[#e8d29b] flex items-center justify-center text-white shadow-md shadow-[#c59c47]/20 group-hover:rotate-12 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-widest uppercase text-zinc-900 leading-none">
                DEMO
              </span>
              <span className="text-[10px] tracking-[0.25em] text-[#ab7f37] font-semibold uppercase mt-0.5">
                Luxury Atelier
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors relative py-1 ${
                    isActive
                      ? "text-[#ab7f37] font-semibold"
                      : "text-zinc-700 hover:text-[#ab7f37]"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#c59c47] to-[#dfc484] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+919876543210"
              className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-zinc-600 hover:text-zinc-900 px-3 py-2 rounded-lg hover:bg-zinc-100/70 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#c59c47]" />
              <span>+91 98765 43210</span>
            </a>

            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-[#9e7529] px-2.5 py-1.5 rounded-full border border-zinc-200 hover:border-[#c59c47]/50 bg-white/70 transition-colors"
              title="Demo Salon Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#c59c47]" />
              <span>Admin Panel</span>
            </Link>

            <Link
              href="/book"
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold text-white overflow-hidden shadow-md shadow-[#c59c47]/20 transition-all duration-300 hover:shadow-lg hover:shadow-[#c59c47]/30 hover:-translate-y-0.5 bg-gradient-to-r from-[#b38936] via-[#c59c47] to-[#a0772c]"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Book Appointment
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/book"
              className="px-3 py-1.5 text-xs font-semibold rounded-full bg-[#c59c47] text-white tracking-wider uppercase shadow-sm"
            >
              Book
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 pb-4 border-t border-zinc-200/80 bg-[#FAF8F5]/98 rounded-2xl shadow-xl px-4 animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#c59c47]/15 text-[#9e7529] font-semibold"
                        : "text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              <div className="h-[1px] bg-zinc-200 my-1" />

              <div className="flex items-center justify-between py-2 px-1">
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-xs font-medium text-zinc-700 hover:text-[#9e7529]"
                >
                  <ShieldCheck className="w-4 h-4 text-[#c59c47]" />
                  <span>Admin Panel (Demo)</span>
                </Link>

                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-1.5 text-xs text-zinc-600 font-medium"
                >
                  <Phone className="w-3.5 h-3.5 text-[#c59c47]" />
                  Call Us
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
