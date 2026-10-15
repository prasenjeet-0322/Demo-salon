"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Scissors,
  ShieldCheck,
  Share2,
  Download,
  Plus,
  Trash2,
  Search,
} from "lucide-react";
import { Service, Booking, ServiceCategory } from "@/types";
import { storage } from "@/lib/storage";
import {
  formatINR,
  formatDuration,
  formatDatePretty,
  getTodayDateString,
  TIME_SLOTS,
} from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useToast } from "@/components/Toast";

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();

  const [step, setStep] = useState<number>(1);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [serviceSearch, setServiceSearch] = useState<string>("");

  // Step 2: Date & Time
  const todayStr = useMemo(() => getTodayDateString(), []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  // Step 3: Customer Details
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Success state
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize services and preselect query params
  useEffect(() => {
    const allServices = storage.getServices().filter((s) => s.isActive);
    setServices(allServices);

    const serviceParam = searchParams.get("service");
    const servicesParam = searchParams.get("services");

    if (serviceParam) {
      if (allServices.some((s) => s.id === serviceParam)) {
        setSelectedServiceIds([serviceParam]);
      }
    } else if (servicesParam) {
      const ids = servicesParam.split(",").filter((id) => allServices.some((s) => s.id === id));
      if (ids.length > 0) {
        setSelectedServiceIds(ids);
      }
    }

    // Refresh if services change
    const unsubscribe = storage.subscribe(() => {
      setServices(storage.getServices().filter((s) => s.isActive));
    });

    return unsubscribe;
  }, [searchParams]);

  // Step transition helper that immediately resets scroll to top so steps never open from the bottom
  const goToStep = (newStep: number) => {
    setStep(newStep);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 40);
    }
  };

  // Scroll to top whenever step changes so steps never open from the bottom
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      const t = setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 50);
      return () => clearTimeout(t);
    }
  }, [step]);


  // Fetch booked slots whenever selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      const slots = storage.getBookedSlots(selectedDate);
      setBookedSlots(slots);
      // If the previously selected time slot is now booked on this date, reset it
      if (selectedTime && slots.includes(selectedTime)) {
        setSelectedTime("");
      }
    }
  }, [selectedDate, selectedTime]);

  // Computed summary
  const selectedServicesList = useMemo(() => {
    return services.filter((s) => selectedServiceIds.includes(s.id));
  }, [services, selectedServiceIds]);

  const totalPrice = useMemo(() => {
    return selectedServicesList.reduce((acc, curr) => acc + curr.price, 0);
  }, [selectedServicesList]);

  const totalDuration = useMemo(() => {
    return selectedServicesList.reduce((acc, curr) => acc + curr.duration, 0);
  }, [selectedServicesList]);

  // Handle service toggle
  const toggleService = (id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    if (errors.services) {
      setErrors((prev) => ({ ...prev, services: "" }));
    }
  };

  // Step 1 Validation
  const validateStep1 = () => {
    if (selectedServiceIds.length === 0) {
      setErrors({ services: "Please select at least one salon service to proceed." });
      toast.error("Selection Required", "Please choose at least one service.");
      return false;
    }
    setErrors({});
    return true;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    const errs: { [key: string]: string } = {};
    if (!selectedDate) {
      errs.date = "Please select an appointment date.";
    } else if (selectedDate < todayStr) {
      errs.date = "Appointment date cannot be in the past.";
    }

    if (!selectedTime) {
      errs.time = "Please pick a preferred time slot.";
    } else if (bookedSlots.includes(selectedTime)) {
      errs.time = "This time slot is already booked. Please pick another.";
    }

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error("Date & Time Required", Object.values(errs)[0]);
      return false;
    }
    return true;
  };

  // Step 3 Validation
  const validateStep3 = () => {
    const errs: { [key: string]: string } = {};
    const cleanPhone = customerPhone.replace(/\D/g, "");

    if (!customerName.trim()) {
      errs.name = "Full name is required.";
    } else if (customerName.trim().length < 2) {
      errs.name = "Please enter your full name.";
    }

    if (!customerPhone.trim()) {
      errs.phone = "Phone number is required.";
    } else if (cleanPhone.length !== 10) {
      errs.phone = "Please enter a valid 10-digit mobile number.";
    }

    if (customerEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerEmail.trim())) {
        errs.email = "Please enter a valid email address.";
      }
    }

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error("Form Incomplete", Object.values(errs)[0]);
      return false;
    }
    return true;
  };

  // Handle final submission
  const handleConfirmBooking = () => {
    setIsSubmitting(true);

    // Double check availability one more time to avoid race condition
    const isBooked = storage.isSlotBooked(selectedDate, selectedTime);
    if (isBooked) {
      setIsSubmitting(false);
      toast.error(
        "Slot Just Booked",
        "Someone else just booked this time slot. Please choose another time."
      );
      goToStep(2);
      setBookedSlots(storage.getBookedSlots(selectedDate));
      return;
    }

    const result = storage.addBooking({
      customerName: customerName.trim(),
      customerPhone: customerPhone.replace(/\D/g, ""),
      customerEmail: customerEmail.trim() || undefined,
      customerNotes: customerNotes.trim() || undefined,
      serviceIds: selectedServiceIds,
      date: selectedDate,
      time: selectedTime,
    });

    if (result.success && result.booking) {
      setCompletedBooking(result.booking);
      setIsSubmitting(false);
      goToStep(5); // Success step
      toast.success("Appointment Confirmed!", `Booking ID: ${result.booking.id}`);

      // Fire celebratory confetti
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#c59c47", "#e3cc94", "#121214", "#d5b56b"],
        });
      } catch {
        // Confetti fallback
      }
    } else {
      setIsSubmitting(false);
      toast.error("Booking Error", result.error || "Unable to reserve appointment.");
    }
  };

  const categories = ["All", "Hair", "Skin", "Nails", "Bridal & Makeup", "Grooming"];

  const filteredServices = services.filter((s) => {
    const matchCat = selectedCategory === "All" || s.category === selectedCategory;
    const matchSearch =
      s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      s.category.toLowerCase().includes(serviceSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#e3cc94] text-xs font-semibold uppercase tracking-widest text-[#ab7f37]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Online Booking</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900">
              Reserve Your Salon Ritual
            </h1>
            <p className="text-zinc-600 text-xs sm:text-sm">
              Lock in your luxury experience in 4 simple steps. Real-time slot locking with no advance payment needed for demo.
            </p>
          </div>

          {/* Stepper Progress Indicator (Steps 1-4) */}
          {step <= 4 && (
            <div className="mb-6 sm:mb-10">
              <div className="flex items-center justify-between relative max-w-2xl mx-auto px-2">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-200 -translate-y-1/2 z-0" />
                <div
                  className="absolute top-1/2 left-0 h-0.5 bg-[#c59c47] -translate-y-1/2 z-0 transition-all duration-300"
                  style={{ width: `${((step - 1) / 3) * 100}%` }}
                />

                {[
                  { num: 1, label: "Services" },
                  { num: 2, label: "Date & Time" },
                  { num: 3, label: "Details" },
                  { num: 4, label: "Confirm" },
                ].map((s) => {
                  const isCurrent = step === s.num;
                  const isCompleted = step > s.num;
                  return (
                    <button
                      key={s.num}
                      type="button"
                      disabled={s.num > step}
                      onClick={() => {
                        if (s.num < step) goToStep(s.num);
                      }}
                      className={`relative z-10 flex flex-col items-center group ${
                        s.num < step ? "cursor-pointer" : "cursor-default"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold transition-all duration-300 ${
                          isCompleted
                            ? "bg-[#c59c47] text-white ring-4 ring-[#FAF8F5] group-hover:scale-105"
                            : isCurrent
                            ? "bg-zinc-900 text-white ring-4 ring-[#c59c47]/20"
                            : "bg-white text-zinc-400 border border-zinc-200"
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" /> : s.num}
                      </div>
                      <span
                        className={`text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase mt-1.5 ${
                          isCurrent ? "text-zinc-900" : "text-zinc-400"
                        }`}
                      >
                        {s.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 1: SERVICE SELECTION */}
          {/* ========================================================================= */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Category Filter & Search */}
              <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                        selectedCategory === cat
                          ? "bg-zinc-900 text-white"
                          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search treatment..."
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full border border-zinc-200 bg-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#c59c47]"
                  />
                </div>
              </div>

              {errors.services && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.services}</span>
                </div>
              )}

              {/* Service Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredServices.map((service) => {
                  const isSelected = selectedServiceIds.includes(service.id);
                  return (
                    <div
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`group cursor-pointer rounded-2xl p-4 transition-all duration-200 border-2 relative flex flex-col justify-between ${
                        isSelected
                          ? "bg-[#FAF5EB] border-[#c59c47] shadow-md shadow-[#c59c47]/10"
                          : "bg-white border-zinc-200 hover:border-[#c59c47]/40 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex gap-3.5">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-zinc-100">
                          <Image
                            src={service.image}
                            alt={service.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#ab7f37]">
                              {service.category}
                            </span>
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                                isSelected ? "bg-[#c59c47] text-white" : "border border-zinc-300"
                              }`}
                            >
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </div>

                          <h3 className="font-serif text-sm font-bold text-zinc-900 truncate">
                            {service.name}
                          </h3>

                          <p className="text-zinc-500 text-xs line-clamp-2 mt-0.5 leading-snug">
                            {service.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-100 text-xs">
                        <span className="text-zinc-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-zinc-400" />
                          {formatDuration(service.duration)}
                        </span>
                        <span className="font-bold text-zinc-900 font-serif text-sm text-[#ab7f37]">
                          {formatINR(service.price)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="sticky bottom-3 z-20 bg-zinc-900/95 backdrop-blur-md text-white px-3.5 py-2.5 sm:px-6 sm:py-3.5 rounded-xl sm:rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 border border-zinc-800">
                <div className="flex items-center justify-between w-full sm:w-auto gap-2 sm:gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-[#c59c47] shrink-0" />
                    <span>
                      <strong className="text-white">{selectedServiceIds.length}</strong> {selectedServiceIds.length === 1 ? "treatment" : "treatments"}
                    </span>
                  </div>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-400">
                    {formatDuration(totalDuration)}
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-[#dfc484] font-serif font-bold text-sm">
                    {formatINR(totalPrice)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (validateStep1()) goToStep(2);
                  }}
                  className="w-full sm:w-auto px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl text-xs font-semibold bg-gradient-to-r from-[#b38936] via-[#c59c47] to-[#9e7529] text-white hover:brightness-110 flex items-center justify-center gap-1.5 shadow-md shadow-[#c59c47]/20 transition-all active:scale-95"
                >
                  <span>Continue to Date & Time</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: DATE & TIME SELECTION */}
          {/* ========================================================================= */}
          {step === 2 && (
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-zinc-200/80 shadow-sm space-y-6 sm:space-y-8 animate-in fade-in duration-300">
              <div className="border-b border-zinc-100 pb-3 sm:pb-4">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-zinc-900">
                  Select Appointment Date & Time Slot
                </h2>
                <p className="text-zinc-500 text-xs sm:text-sm mt-1">
                  Choose a date and an available 30-minute arrival window. Time slots already reserved by others are locked.
                </p>
              </div>

              {/* Date Input */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-[#ab7f37]" />
                  <span>Choose Date</span>
                </label>
                <div className="max-w-xs">
                  <input
                    type="date"
                    min={todayStr}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#c59c47]"
                  />
                  {errors.date && (
                    <p className="text-rose-600 text-xs mt-1">{errors.date}</p>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400">
                  Selected: <strong>{formatDatePretty(selectedDate)}</strong>
                </p>
              </div>

              {/* Time Slots Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#ab7f37]" />
                    <span>Available Time Slots (10:00 AM – 07:00 PM)</span>
                  </label>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1.5 text-zinc-500">
                      <span className="w-2.5 h-2.5 rounded-full bg-white border border-zinc-300" />
                      Available
                    </span>
                    <span className="flex items-center gap-1.5 text-zinc-500">
                      <span className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
                      Booked
                    </span>
                  </div>
                </div>

                {errors.time && (
                  <p className="text-rose-600 text-xs">{errors.time}</p>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
                  {TIME_SLOTS.map((slot) => {
                    const isBooked = bookedSlots.includes(slot);
                    const isSelected = selectedTime === slot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isBooked}
                        onClick={() => {
                          setSelectedTime(slot);
                          if (errors.time) setErrors((prev) => ({ ...prev, time: "" }));
                        }}
                        className={`py-3 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 border text-center relative ${
                          isBooked
                            ? "bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed line-through opacity-60"
                            : isSelected
                            ? "bg-[#c59c47] text-white border-[#c59c47] shadow-md shadow-[#c59c47]/30 scale-[1.02]"
                            : "bg-white text-zinc-800 border-zinc-200 hover:border-[#c59c47] hover:bg-[#FAF8F5]"
                        }`}
                      >
                        {slot}
                        {isBooked && (
                          <span className="block text-[9px] no-underline font-normal text-zinc-400 mt-0.5">
                            Reserved
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between gap-2 sm:gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="px-3.5 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs font-medium text-zinc-600 hover:text-zinc-900 border border-zinc-200 flex items-center gap-1.5 transition-colors active:scale-95 shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (validateStep2()) goToStep(3);
                  }}
                  className="px-4 sm:px-5 py-2 rounded-lg sm:rounded-xl text-xs font-semibold bg-zinc-900 text-white hover:bg-[#ab7f37] transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <span>Continue to Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: CUSTOMER DETAILS */}
          {/* ========================================================================= */}
          {step === 3 && (
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-zinc-200/80 shadow-sm space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-zinc-100 pb-3 sm:pb-4">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-zinc-900">
                  Guest Contact Information
                </h2>
                <p className="text-zinc-500 text-xs sm:text-sm mt-1">
                  We use your details to confirm your reservation and send appointment reminders.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#ab7f37]" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Meera Kapoor"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#c59c47] ${
                      errors.name ? "border-rose-300 bg-rose-50/30" : "border-zinc-300"
                    }`}
                  />
                  {errors.name && <p className="text-rose-600 text-xs">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#ab7f37]" />
                    <span>Phone Number (10 digits) *</span>
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-zinc-300 bg-zinc-100 text-zinc-600 text-xs font-semibold">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="9876543210"
                      value={customerPhone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setCustomerPhone(val);
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                      }}
                      className={`w-full px-4 py-2.5 rounded-r-xl border text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#c59c47] ${
                        errors.phone ? "border-rose-300 bg-rose-50/30" : "border-zinc-300"
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-rose-600 text-xs">{errors.phone}</p>}
                </div>

                {/* Email (Optional) */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#ab7f37]" />
                    <span>Email Address (Optional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. meera@example.com"
                    value={customerEmail}
                    onChange={(e) => {
                      setCustomerEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#c59c47] ${
                      errors.email ? "border-rose-300 bg-rose-50/30" : "border-zinc-300"
                    }`}
                  />
                  {errors.email && <p className="text-rose-600 text-xs">{errors.email}</p>}
                  <p className="text-[11px] text-zinc-400">
                    We will send an appointment calendar invitation and receipt here if provided.
                  </p>
                </div>

                {/* Notes */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#ab7f37]" />
                    <span>Special Requests or Notes (Optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Any hair/scalp concerns, skin sensitivities, or styling preferences..."
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#c59c47]"
                  />
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between gap-2 sm:gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="px-3.5 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs font-medium text-zinc-600 hover:text-zinc-900 border border-zinc-200 flex items-center gap-1.5 transition-colors active:scale-95 shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (validateStep3()) goToStep(4);
                  }}
                  className="px-4 sm:px-5 py-2 rounded-lg sm:rounded-xl text-xs font-semibold bg-zinc-900 text-white hover:bg-[#ab7f37] transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <span>Review Booking</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: REVIEW SUMMARY & CONFIRM */}
          {/* ========================================================================= */}
          {step === 4 && (
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-zinc-200/80 shadow-sm space-y-5 sm:space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-zinc-100 pb-3 sm:pb-4">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-zinc-900">
                  Review & Confirm Your Reservation
                </h2>
                <p className="text-zinc-500 text-xs sm:text-sm mt-1">
                  Please review your selected services, appointment schedule, and contact info before confirming.
                </p>
              </div>

              {/* Top appointment recap pill */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#eaddd0] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#c59c47]/15 flex items-center justify-center text-[#ab7f37]">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                      Scheduled Date & Time
                    </span>
                    <p className="font-serif text-base font-bold text-zinc-900">
                      {formatDatePretty(selectedDate)} at {selectedTime}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="text-xs text-[#ab7f37] hover:underline font-semibold"
                >
                  Change Date/Time
                </button>
              </div>

              {/* Guest Details Summary */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 space-y-2 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
                  <span className="text-zinc-500 font-semibold uppercase tracking-wider">
                    Guest Information
                  </span>
                  <button
                    type="button"
                    onClick={() => goToStep(3)}
                    className="text-[#ab7f37] hover:underline font-semibold"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-700 pt-1">
                  <p>
                    <strong className="text-zinc-900">Name:</strong> {customerName}
                  </p>
                  <p>
                    <strong className="text-zinc-900">Phone:</strong> +91 {customerPhone}
                  </p>
                  {customerEmail && (
                    <p>
                      <strong className="text-zinc-900">Email:</strong> {customerEmail}
                    </p>
                  )}
                  {customerNotes && (
                    <p className="sm:col-span-2">
                      <strong className="text-zinc-900">Notes:</strong> {customerNotes}
                    </p>
                  )}
                </div>
              </div>

              {/* Selected Services Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <h4 className="font-bold uppercase tracking-wider text-zinc-700">
                    Selected Treatments ({selectedServicesList.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => goToStep(1)}
                    className="text-[#ab7f37] hover:underline font-semibold"
                  >
                    Modify Treatments
                  </button>
                </div>

                <div className="space-y-2">
                  {selectedServicesList.map((srv) => (
                    <div
                      key={srv.id}
                      className="p-3 rounded-xl bg-[#FAF8F5] border border-zinc-200/60 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                          <Image src={srv.image} alt={srv.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-serif font-bold text-zinc-900 text-sm">{srv.name}</p>
                          <span className="text-zinc-400 text-[11px]">
                            {srv.category} • {formatDuration(srv.duration)}
                          </span>
                        </div>
                      </div>
                      <span className="font-serif font-bold text-zinc-900 text-sm text-[#ab7f37]">
                        {formatINR(srv.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Duration Totals */}
              <div className="pt-4 border-t border-zinc-200 space-y-2 text-sm">
                <div className="flex justify-between text-zinc-500 text-xs">
                  <span>Estimated Treatment Duration</span>
                  <span className="font-medium text-zinc-800">{formatDuration(totalDuration)}</span>
                </div>
                <div className="flex justify-between text-zinc-500 text-xs">
                  <span>Taxes & Sanctuary Amenities</span>
                  <span className="font-medium text-emerald-600">Included</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-dashed border-zinc-200">
                  <span className="font-serif font-bold text-zinc-900 text-lg">Total Amount</span>
                  <span className="font-serif font-bold text-2xl text-[#ab7f37]">
                    {formatINR(totalPrice)}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 text-right">
                  Payment is settled at the atelier upon completion of service.
                </p>
              </div>

              {/* Confirm CTA */}
              <div className="flex items-center justify-between gap-2 sm:gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => goToStep(3)}
                  className="px-3.5 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs font-medium text-zinc-600 hover:text-zinc-900 border border-zinc-200 flex items-center gap-1.5 transition-colors active:scale-95 shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmBooking}
                  className="px-4 sm:px-5 py-2.5 rounded-lg sm:rounded-xl text-xs font-bold bg-gradient-to-r from-[#b38936] via-[#c59c47] to-[#9e7529] text-white hover:brightness-110 shadow-md shadow-[#c59c47]/20 flex items-center justify-center gap-1.5 transition-all text-center whitespace-nowrap active:scale-95"
                >
                  {isSubmitting ? (
                    <span>Securing Slot...</span>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span>Confirm Booking</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 5: SUCCESS CONFIRMATION */}
          {/* ========================================================================= */}
          {step === 5 && completedBooking && (
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#e3cc94] shadow-xl text-center space-y-6 max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#ab7f37]">
                  Reservation Confirmed
                </span>
                <h2 className="font-serif text-3xl font-bold text-zinc-900">
                  We Look Forward to Welcoming You
                </h2>
                <p className="text-zinc-600 text-xs sm:text-sm max-w-md mx-auto">
                  Thank you, <strong className="text-zinc-900">{completedBooking.customerName}</strong>. Your appointment has been secured at DEMO Luxury Atelier.
                </p>
              </div>

              {/* Booking Reference Card */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#eaddd0] text-left space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
                      Booking Reference ID
                    </span>
                    <p className="font-mono text-lg font-bold text-zinc-900">
                      {completedBooking.id}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                    Confirmed
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-zinc-400 block text-[11px]">Appointment Date</span>
                    <strong className="text-zinc-900 text-sm">
                      {formatDatePretty(completedBooking.date)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[11px]">Arrival Time Slot</span>
                    <strong className="text-zinc-900 text-sm">{completedBooking.time}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[11px]">Contact Phone</span>
                    <strong className="text-zinc-900">+91 {completedBooking.customerPhone}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[11px]">Total Payable at Salon</span>
                    <strong className="text-[#ab7f37] text-sm font-serif">
                      {formatINR(completedBooking.totalPrice)}
                    </strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-200 text-xs">
                  <span className="text-zinc-400 block text-[11px] mb-1">Booked Treatments:</span>
                  <ul className="space-y-1">
                    {completedBooking.servicesSummary.map((s) => (
                      <li key={s.id} className="flex justify-between text-zinc-700">
                        <span>• {s.name}</span>
                        <span className="font-medium">{formatINR(s.price)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Customer Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    goToStep(1);
                    setSelectedServiceIds([]);
                    setSelectedTime("");
                    setCompletedBooking(null);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold bg-zinc-900 text-white hover:bg-[#ab7f37] flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Book Another Appointment</span>
                </button>

                <Link
                  href="/"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-medium text-zinc-700 hover:text-zinc-900 border border-zinc-200 hover:bg-zinc-50 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <span>Return to Home</span>
                </Link>
              </div>

              <p className="text-[11px] text-zinc-400 pt-2">
                A verification code and instant booking summary is stored locally in this browser.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#c59c47] border-t-transparent rounded-full animate-spin" />
            <p className="font-serif text-sm text-zinc-600">Loading Salon Atelier...</p>
          </div>
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
