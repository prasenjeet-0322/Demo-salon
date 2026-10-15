import React from "react";
import Link from "next/link";
import { Sparkles, Calendar, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeaturedServices } from "@/components/FeaturedServices";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { Gallery } from "@/components/Gallery";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      {/* Sticky Top Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Featured Signature Services */}
        <FeaturedServices />

        {/* The DEMO Standard / Why Choose Us */}
        <WhyChooseUs />

        {/* Atelier Visual Gallery */}
        <Gallery />

        {/* Verified Patrons Testimonials */}
        <Testimonials />

        {/* Luxury Booking Callout Banner */}
        <section className="py-20 bg-dark-mesh text-white relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#c59c47]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#dfc484] text-xs font-semibold uppercase tracking-widest border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Limited Weekly Reservations</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Ready to Experience the Art of Self-Care?
            </h2>

            <p className="text-zinc-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Book your customized ritual today. Select your preferred services, choose a convenient time slot, and let our master artists pamper you.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/book"
                className="w-full sm:w-auto px-8 py-4 rounded-full text-xs sm:text-sm uppercase tracking-widest font-bold text-white shadow-xl shadow-[#c59c47]/25 hover:shadow-[#c59c47]/40 hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-[#b38936] via-[#c59c47] to-[#9e7529] flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve My Appointment</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              <Link
                href="/services"
                className="w-full sm:w-auto px-7 py-4 rounded-full text-xs sm:text-sm uppercase tracking-widest font-semibold text-zinc-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-all text-center"
              >
                Explore Full Price List
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Luxury Footer */}
      <Footer />
    </div>
  );
}
