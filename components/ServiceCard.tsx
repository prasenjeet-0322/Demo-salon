"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight, Sparkles, Check } from "lucide-react";
import { Service } from "@/types";
import { formatINR, formatDuration } from "@/lib/utils";

interface ServiceCardProps {
  service: Service;
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelect?: (service: Service) => void;
  showBookButton?: boolean;
}

export function ServiceCard({
  service,
  isSelectable = false,
  isSelected = false,
  onSelect,
  showBookButton = true,
}: ServiceCardProps) {
  const handleCardClick = () => {
    if (isSelectable && onSelect) {
      onSelect(service);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between ${
        isSelectable
          ? `cursor-pointer border-2 ${
              isSelected
                ? "border-[#c59c47] bg-[#fbf8f0] shadow-lg shadow-[#c59c47]/15 ring-2 ring-[#c59c47]/20"
                : "border-zinc-200/80 bg-white hover:border-[#c59c47]/50 hover:shadow-md"
            }`
          : "border border-[#eaddd0]/80 bg-white shadow-sm hover:shadow-xl hover:shadow-[#141416]/5 hover:-translate-y-1"
      }`}
    >
      {/* Top Image Container */}
      <div className="relative h-52 w-full overflow-hidden bg-zinc-100">
        <Image
          src={service.image}
          alt={service.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-white/90 backdrop-blur-md text-zinc-800 shadow-sm">
            {service.category}
          </span>
          {service.badge && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-gradient-to-r from-[#b38936] to-[#c59c47] text-white shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {service.badge}
            </span>
          )}
        </div>

        {/* Selection Checkmark when selectable */}
        {isSelectable && (
          <div
            className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isSelected
                ? "bg-[#c59c47] text-white scale-110 shadow-md shadow-[#c59c47]/40"
                : "bg-white/80 backdrop-blur-sm text-zinc-400 group-hover:text-zinc-600"
            }`}
          >
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
        )}
      </div>

      {/* Card Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-serif text-lg font-bold text-zinc-900 leading-snug group-hover:text-[#ab7f37] transition-colors">
              {service.name}
            </h3>
          </div>

          <p className="text-zinc-500 text-xs sm:text-sm line-clamp-2 mb-4 leading-relaxed">
            {service.description}
          </p>
        </div>

        <div>
          {/* Duration & Price Row */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-100 mb-4">
            <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-medium">
              <Clock className="w-3.5 h-3.5 text-[#ab7f37]" />
              <span>{formatDuration(service.duration)}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-zinc-400 block font-normal">Starting at</span>
              <span className="text-lg font-bold text-zinc-900 tracking-tight font-serif text-[#ab7f37]">
                {formatINR(service.price)}
              </span>
            </div>
          </div>

          {/* Action Button */}
          {!isSelectable && showBookButton && (
            <Link
              href={`/book?service=${encodeURIComponent(service.id)}`}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider bg-zinc-900 hover:bg-[#ab7f37] text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-sm hover:shadow-md hover:shadow-[#c59c47]/20"
            >
              <span>Book Appointment</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          )}

          {isSelectable && (
            <div
              className={`w-full py-2 px-3 rounded-lg text-xs font-semibold text-center transition-colors ${
                isSelected
                  ? "bg-[#c59c47] text-white"
                  : "bg-zinc-100 text-zinc-700 group-hover:bg-[#c59c47]/10 group-hover:text-[#ab7f37]"
              }`}
            >
              {isSelected ? "Service Selected" : "+ Select Service"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
