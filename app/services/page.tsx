"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Sparkles, Search, ArrowRight, Check, X, Filter } from "lucide-react";
import { Service, ServiceCategory } from "@/types";
import { storage } from "@/lib/storage";
import { formatINR, formatDuration } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ServiceCard } from "@/components/ServiceCard";

const CATEGORIES: (ServiceCategory | "All")[] = [
  "All",
  "Hair",
  "Skin",
  "Nails",
  "Bridal & Makeup",
  "Grooming",
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setServices(storage.getServices().filter((s) => s.isActive));

    const unsubscribe = storage.subscribe(() => {
      setServices(storage.getServices().filter((s) => s.isActive));
    });

    return unsubscribe;
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesCategory =
        selectedCategory === "All" || service.category === selectedCategory;
      const matchesSearch =
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [services, selectedCategory, searchQuery]);

  const toggleSelectService = (service: Service) => {
    setSelectedServices((prev) =>
      prev.includes(service.id)
        ? prev.filter((id) => id !== service.id)
        : [...prev, service.id]
    );
  };

  const selectedObjects = services.filter((s) => selectedServices.includes(s.id));
  const totalAmount = selectedObjects.reduce((acc, curr) => acc + curr.price, 0);
  const totalTime = selectedObjects.reduce((acc, curr) => acc + curr.duration, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      <main className="flex-1 pt-28 pb-24">
        {/* Page Header */}
        <div className="bg-cream-mesh border-b border-[#eaddd0]/80 py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#e3cc94] text-xs font-semibold uppercase tracking-widest text-[#ab7f37] mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Menu of Experiences</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-zinc-900 tracking-tight mb-4">
              Our Salon & Spa Services
            </h1>
            <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
              Explore our comprehensive collection of couture hair rituals, dermatologist-approved clinical facials, artisanal nail creations, and royal bridal treatments.
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-zinc-200/80">
            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-zinc-900 text-white shadow-md shadow-zinc-900/10"
                        : "bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200/80"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-full border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#c59c47] focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Result Count and Quick Tip */}
          <div className="flex items-center justify-between py-4 text-xs text-zinc-500">
            <span>
              Showing <strong className="text-zinc-900">{filteredServices.length}</strong> treatments
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
            </span>
            <span className="hidden sm:inline text-zinc-400">
              Prices include taxes • Custom packages available
            </span>
          </div>

          {/* Services Grid */}
          {filteredServices.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-zinc-200/80 my-6">
              <Filter className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold text-zinc-800">No services found</h3>
              <p className="text-zinc-500 text-xs mt-1">
                Try adjusting your search query or switching categories.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-4 px-4 py-2 rounded-full text-xs font-semibold bg-zinc-900 text-white"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-2">
              {filteredServices.map((service) => (
                <ServiceCard key={service.id} service={service} showBookButton={true} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
