import React from "react";
import { Star, Quote, Sparkles } from "lucide-react";
import Image from "next/image";

export function Testimonials() {
  const reviews = [
    {
      name: "Natasha Roy",
      role: "Architect & Creative Director",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
      treatment: "Moroccan Argan Hair Spa & Balayage",
      quote:
        "DEMO is in a league of its own. My balayage tone was customized to perfection with zero brassiness, and the head massage in their private suite melted a month of work stress away.",
      rating: 5,
    },
    {
      name: "Dr. Aisha Menon",
      role: "Dermatologist",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
      treatment: "Clinical Vortex Hydra Facial",
      quote:
        "As a skin specialist, I am extremely selective about clinic hygiene and product purity. DEMO's Hydra Facial protocol followed international standards flawlessly. My skin was glowing for weeks.",
      rating: 5,
    },
    {
      name: "Devika & Arjun Mehta",
      role: "Bridal Couple",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      treatment: "Royal Heritage Bridal & Grooming Suite",
      quote:
        "From the first trial consultation to our wedding day morning, the DEMO team felt like family. Every photo turned out ethereal. Booking them was the single best decision for our wedding.",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#ab7f37]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Client Praise</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 tracking-tight">
            Loved By Discerning Patrons
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base">
            Read stories from individuals who made DEMO their personal beauty and wellness sanctuary.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-[#FAF8F5] border border-[#eaddd0]/80 shadow-sm flex flex-col justify-between hover:shadow-xl hover:shadow-[#c59c47]/10 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1 text-[#ab7f37]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-[#e2d4bf]/60 stroke-1" />
                </div>

                <p className="text-zinc-700 text-sm sm:text-base leading-relaxed italic mb-6">
                  &ldquo;{rev.quote}&rdquo;
                </p>
              </div>

              <div className="pt-6 border-t border-zinc-200/80 flex items-center gap-3.5">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#c59c47]/40 shrink-0">
                  <Image
                    src={rev.avatar}
                    alt={rev.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-zinc-900">{rev.name}</h4>
                  <p className="text-[11px] text-zinc-500">{rev.role}</p>
                  <span className="text-[11px] font-semibold text-[#9e7529] block mt-0.5">
                    {rev.treatment}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
