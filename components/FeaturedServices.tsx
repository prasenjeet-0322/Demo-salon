"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Service } from "@/types";
import { storage } from "@/lib/storage";
import { ServiceCard } from "./ServiceCard";

export function FeaturedServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const list = storage.getServices();
    const active = list.filter((s) => s.isActive);
    const featured = active.filter((s) => s.featured);
    setServices(featured.length > 0 ? featured.slice(0, 6) : active.slice(0, 6));

    const unsubscribe = storage.subscribe(() => {
      const refreshed = storage.getServices();
      const refActive = refreshed.filter((s) => s.isActive);
      const refFeatured = refActive.filter((s) => s.featured);
      setServices(refFeatured.length > 0 ? refFeatured.slice(0, 6) : refActive.slice(0, 6));
    });

    return unsubscribe;
  }, []);

  if (!mounted) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="h-8 w-48 bg-zinc-200 rounded-full mx-auto animate-pulse mb-4" />
          <div className="h-4 w-72 bg-zinc-100 rounded mx-auto animate-pulse" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 lg:py-28 bg-[#FAF8F5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#ab7f37]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Indulgence</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 tracking-tight">
              Our Signature Treatments
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base max-w-xl">
              Immerse yourself in our most requested salon rituals, each tailored to elevate your natural radiance and wellness.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#ab7f37] hover:text-[#89602c] transition-colors group"
          >
            <span>Browse Full Menu</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 p-8 rounded-3xl bg-dark-mesh text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-[#c59c47]/20 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-serif text-2xl font-bold">
              Looking for a custom makeover or bridal consultation?
            </h3>
            <p className="text-zinc-400 text-sm max-w-xl">
              Our master aesthetic directors are available for complimentary 15-minute consultations to design your bespoke look.
            </p>
          </div>

          <Link
            href="/book"
            className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-[#b38936] to-[#c59c47] text-white hover:brightness-110 shadow-lg shadow-[#c59c47]/20 shrink-0"
          >
            Schedule Consultation
          </Link>
        </div>
      </div>
    </section>
  );
}
