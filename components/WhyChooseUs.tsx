import React from "react";
import { Sparkles, Award, ShieldCheck, HeartHandshake, Coffee, Gem } from "lucide-react";

export function WhyChooseUs() {
  const pillars = [
    {
      icon: Award,
      title: "Master Haute Stylists",
      description:
        "Trained in Paris and Milan, our senior directors bring visionary precision and personalized hair architecture to every client.",
    },
    {
      icon: ShieldCheck,
      title: "Clinical & Botanical Purity",
      description:
        "Every treatment uses dermatologically certified, ammonia-free, and organic bio-actives safe for sensitive skin and hair.",
    },
    {
      icon: Gem,
      title: "Private VIP Treatment Suites",
      description:
        "Experience tranquility in sound-isolated suites equipped with ergonomic memory foam styling beds and ambient lighting.",
    },
    {
      icon: Coffee,
      title: "Artisan Welcome Experience",
      description:
        "Sip on chilled French sparkling water, ceremonial grade matcha, or custom herbal infusions while your consultation begins.",
    },
    {
      icon: Sparkles,
      title: "Zero Waiting Guarantee",
      description:
        "We respect your schedule. Booked appointment slots are locked precisely for you with dedicated stylists ready on arrival.",
    },
    {
      icon: HeartHandshake,
      title: "Guaranteed Satisfaction",
      description:
        "If you desire any micro-touchup or styling refinement within 48 hours, we welcome you back with our compliments.",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#ab7f37]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The DEMO Standard</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 tracking-tight">
            Why Our Sanctuary Is Unlike Any Other
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
            We meticulously curate every touchpoint to transform routine grooming into a restorative, memorable ritual.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-[#FAF8F5] border border-[#eaddd0]/70 hover:border-[#c59c47]/50 hover:shadow-xl hover:shadow-[#c59c47]/10 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#9e7529] group-hover:bg-[#c59c47] group-hover:text-white transition-colors duration-300 mb-6">
                  <Icon className="w-6 h-6 stroke-[1.8]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-zinc-900 mb-3 group-hover:text-[#ab7f37] transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
