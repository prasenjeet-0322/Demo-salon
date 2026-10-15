"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, Star, Clock, ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-cream-mesh">
      {/* Decorative luxury ambient circles */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-[#e3cc94]/20 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#e3cc94] shadow-sm backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-[#c59c47] animate-ping" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[#9e7529]">
                Bespoke Salon Atelier & Spa
              </span>
            </div>

            {/* Main Headline with Serif Typography */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 leading-[1.15]">
              Where Refined Artistry Meets{" "}
              <span className="text-gold-gradient italic font-normal">Pure Luxury</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-zinc-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Step into DEMO, an intimate sanctuary crafted for transformative beauty. From bespoke couture hair sculpting and 24K gold facials to unforgettable royal bridal artistry.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/book"
                className="w-full sm:w-auto px-8 py-4 rounded-full text-xs sm:text-sm uppercase tracking-widest font-bold text-white shadow-xl shadow-[#c59c47]/25 hover:shadow-[#c59c47]/40 hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-[#b38936] via-[#c59c47] to-[#9e7529] flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Reserve Appointment</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              <Link
                href="/services"
                className="w-full sm:w-auto px-7 py-4 rounded-full text-xs sm:text-sm uppercase tracking-widest font-semibold text-zinc-800 bg-white hover:bg-zinc-50 border border-zinc-200/80 shadow-sm hover:shadow transition-all duration-300 text-center"
              >
                View Services & Pricing
              </Link>
            </div>

            {/* Trust and Rating Highlights */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-zinc-200/80 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-1 text-[#ab7f37] mb-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-zinc-900 text-base">4.9</span>
                </div>
                <p className="text-zinc-500 text-xs">1,400+ Verified Reviews</p>
              </div>

              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-1 text-[#ab7f37] mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="font-bold text-zinc-900 text-base">100%</span>
                </div>
                <p className="text-zinc-500 text-xs">Zero Waiting Guarantee</p>
              </div>

              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-1 text-[#ab7f37] mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="font-bold text-zinc-900 text-base">Master</span>
                </div>
                <p className="text-zinc-500 text-xs">European Stylists</p>
              </div>
            </div>
          </div>

          {/* Right Image Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative ring */}
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-[#c59c47]/20 via-[#f7e0d8] to-transparent blur-xl" />

              {/* Main Luxury Image */}
              <div className="relative h-[480px] sm:h-[540px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/90">
                <Image
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000&auto=format&fit=crop"
                  alt="Luxury Salon Interior & Experience"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {/* Floating Bottom Card */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-white/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#c59c47]/15 flex items-center justify-center text-[#9e7529]">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                          Signature Hydra Facial
                        </h4>
                        <p className="text-[11px] text-zinc-500">Instant Glass Glow • 80 mins</p>
                      </div>
                    </div>
                    <Link
                      href="/book?service=skin-hydra-facial"
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-[11px] font-semibold hover:bg-[#c59c47] transition-colors"
                    >
                      Book ₹3,999
                    </Link>
                  </div>
                </div>

                {/* Floating Top Pill */}
                <div className="absolute top-5 right-5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Slots Open Today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
