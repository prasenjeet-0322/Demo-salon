"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Lock,
  LogOut,
  RotateCcw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Eye,
  Trash2,
  Edit2,
  Plus,
  ArrowUpDown,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  TrendingUp,
  DollarSign,
  Layers,
  ChevronRight,
  ExternalLink,
  Radio,
  X,
  RefreshCw,
} from "lucide-react";
import { Booking, BookingStatus, Service, ServiceCategory } from "@/types";
import { storage } from "@/lib/storage";
import {
  formatINR,
  formatDuration,
  formatDatePretty,
  getTodayDateString,
} from "@/lib/utils";
import { useToast } from "@/components/Toast";

export default function AdminPage() {
  const toast = useToast();

  // Authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [mounted, setMounted] = useState(false);

  // Active Tab: 'bookings' | 'services'
  const [activeTab, setActiveTab] = useState<"bookings" | "services">("bookings");

  // Data state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  // Bookings Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [dateFilter, setDateFilter] = useState<"All" | "Today" | "Custom">("All");
  const [customDate, setCustomDate] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  // Modals
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDeleteConfirmId, setShowDeleteConfirmId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Service Edit / Create Modal
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreatingService, setIsCreatingService] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    category: "Hair" as ServiceCategory,
    description: "",
    duration: 60,
    price: 999,
    image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=800&auto=format&fit=crop",
    isActive: true,
    featured: false,
    badge: "",
  });

  // Load initial data and bind real-time storage event listeners
  const reloadData = useCallback(() => {
    setBookings(storage.getBookings());
    setServices(storage.getServices());
  }, []);

  useEffect(() => {
    setMounted(true);
    const authStatus = storage.getAdminAuth();
    setIsAuthenticated(authStatus);

    reloadData();

    // Subscribe to cross-tab and same-tab storage updates
    const unsubscribe = storage.subscribe((key) => {
      reloadData();
      if (key === "demo_salon_bookings") {
        toast.info("Bookings Updated", "Live update received from browser storage.");
      }
    });

    return unsubscribe;
  }, [reloadData, toast]);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === "admin" && password.trim() === "admin123") {
      storage.setAdminAuth(true);
      setIsAuthenticated(true);
      setLoginError("");
      toast.success("Welcome, Administrator", "Logged into DEMO Salon Manager.");
    } else {
      setLoginError("Invalid credentials. Use demo: admin / admin123");
      toast.error("Access Denied", "Please check your demo username and password.");
    }
  };

  const handleFillDemoCredentials = () => {
    setUsername("admin");
    setPassword("admin123");
    setLoginError("");
  };

  const handleLogout = () => {
    storage.setAdminAuth(false);
    setIsAuthenticated(false);
    toast.info("Logged Out", "Admin session ended.");
  };

  const handleResetData = () => {
    storage.resetDemoData();
    reloadData();
    setShowResetConfirm(false);
    toast.success("Data Reset", "Demo bookings and services restored to initial seed state.");
  };

  // Status update
  const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    storage.updateBookingStatus(bookingId, newStatus);
    toast.success("Status Updated", `Booking #${bookingId} marked as ${newStatus}.`);
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // Delete booking
  const handleDeleteBooking = (id: string) => {
    storage.deleteBooking(id);
    setShowDeleteConfirmId(null);
    if (selectedBooking?.id === id) {
      setSelectedBooking(null);
    }
    toast.success("Booking Removed", `Booking #${id} deleted.`);
  };

  // Services Management handlers
  const handleToggleServiceActive = (id: string) => {
    storage.toggleServiceActive(id);
    toast.info("Service Status Toggled");
  };

  const handleDeleteService = (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      storage.deleteService(id);
      toast.success("Service Deleted");
    }
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      storage.updateService({
        ...editingService,
        ...serviceForm,
      });
      toast.success("Service Updated", serviceForm.name);
      setEditingService(null);
    } else if (isCreatingService) {
      storage.addService(serviceForm);
      toast.success("Service Created", serviceForm.name);
      setIsCreatingService(false);
    }
    reloadData();
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      category: service.category,
      description: service.description,
      duration: service.duration,
      price: service.price,
      image: service.image,
      isActive: service.isActive,
      featured: !!service.featured,
      badge: service.badge || "",
    });
  };

  const openCreateModal = () => {
    setIsCreatingService(true);
    setServiceForm({
      name: "",
      category: "Hair",
      description: "",
      duration: 45,
      price: 999,
      image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=800&auto=format&fit=crop",
      isActive: true,
      featured: false,
      badge: "",
    });
  };

  // Filtered & Sorted Bookings
  const todayStr = useMemo(() => getTodayDateString(), []);

  const filteredBookings = useMemo(() => {
    return bookings
      .filter((b) => {
        // Search
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          b.customerName.toLowerCase().includes(query) ||
          b.customerPhone.includes(query) ||
          b.id.toLowerCase().includes(query) ||
          b.servicesSummary.some((s) => s.name.toLowerCase().includes(query));

        // Status
        const matchesStatus = statusFilter === "All" || b.status === statusFilter;

        // Date
        let matchesDate = true;
        if (dateFilter === "Today") {
          matchesDate = b.date === todayStr;
        } else if (dateFilter === "Custom" && customDate) {
          matchesDate = b.date === customDate;
        }

        return matchesSearch && matchesStatus && matchesDate;
      })
      .sort((a, b) => {
        const timeA = new Date(a.date + " " + a.time).getTime() || new Date(a.createdAt).getTime();
        const timeB = new Date(b.date + " " + b.time).getTime() || new Date(b.createdAt).getTime();
        return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
      });
  }, [bookings, searchQuery, statusFilter, dateFilter, customDate, sortOrder, todayStr]);

  // Dashboard Stats Calculations
  const stats = useMemo(() => {
    const total = bookings.length;
    const todayCount = bookings.filter((b) => b.date === todayStr).length;
    const pendingCount = bookings.filter((b) => b.status === "Pending").length;
    const completedRevenue = bookings
      .filter((b) => b.status === "Completed")
      .reduce((acc, curr) => acc + curr.totalPrice, 0);

    return { total, todayCount, pendingCount, completedRevenue };
  }, [bookings, todayStr]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#c59c47] border-t-transparent rounded-full animate-spin" />
          <p className="font-serif text-sm text-zinc-600">Loading Salon Manager...</p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 1: LOGIN SCREEN
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#141416] p-4 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#c59c47]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-[#1f1f23] border border-[#c59c47]/30 rounded-3xl p-8 shadow-2xl relative z-10 text-white">
          <div className="text-center space-y-2 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#9e7529] via-[#c59c47] to-[#e8d29b] flex items-center justify-center text-white mx-auto shadow-lg shadow-[#c59c47]/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-2xl font-bold tracking-wide">DEMO Admin Atelier</h1>
            <p className="text-zinc-400 text-xs">
              Salon Concierge, Real-Time Bookings & Menu Administration
            </p>
          </div>

          {/* Demo Hint Banner */}
          <div
            onClick={handleFillDemoCredentials}
            className="mb-6 p-3.5 rounded-2xl bg-[#FAF8F5]/10 border border-[#c59c47]/40 text-xs cursor-pointer hover:bg-[#FAF8F5]/15 transition-all group"
          >
            <div className="flex items-center justify-between text-[#dfc484] font-semibold mb-1">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Demo Credentials (Click to Auto-fill)
              </span>
              <span className="text-[10px] text-zinc-400 group-hover:text-white">Auto-fill ➔</span>
            </div>
            <p className="text-zinc-300 font-mono text-[11px]">
              Username: <strong className="text-white">admin</strong> • Password:{" "}
              <strong className="text-white">admin123</strong>
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Admin Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#c59c47] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#c59c47] transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-[#b38936] via-[#c59c47] to-[#9e7529] text-white hover:brightness-110 transition-all shadow-lg shadow-[#c59c47]/20 flex items-center justify-center gap-2 mt-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Access Admin Dashboard</span>
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
            <Link
              href="/"
              className="text-xs text-zinc-400 hover:text-[#c59c47] transition-colors inline-flex items-center gap-1"
            >
              <span>← Back to Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED ADMIN DASHBOARD
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-zinc-900 flex flex-col">
      {/* Top Admin Bar */}
      <header className="bg-zinc-900 text-white border-b border-zinc-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-[#c59c47] flex items-center justify-center text-white font-bold">
                D
              </div>
              <div>
                <span className="font-serif text-base font-bold tracking-wider uppercase block leading-none">
                  DEMO Admin
                </span>
                <span className="text-[10px] text-[#dfc484] tracking-widest uppercase">
                  Sanctuary Portal
                </span>
              </div>
            </Link>

            {/* Live Sync Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-xs text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px]">Live Sync Active</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden md:flex items-center gap-1 text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <span>View Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors"
              title="Erase mock bookings and start clean"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Erase Mock Data</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 w-full space-y-6 sm:space-y-8">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {/* Card 1: Total Bookings */}
          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-zinc-200/80 shadow-sm flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-zinc-500 block truncate">
                Total Bookings
              </span>
              <span className="text-xl sm:text-3xl font-serif font-bold text-zinc-900 mt-1 block">
                {stats.total}
              </span>
              <span className="text-[10px] sm:text-[11px] text-zinc-400 mt-0.5 block truncate">
                Stored in browser
              </span>
            </div>
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-zinc-100 text-zinc-800 flex items-center justify-center shrink-0 ml-2">
              <Calendar className="w-4 h-4 sm:w-6 sm:h-6 stroke-[1.8]" />
            </div>
          </div>

          {/* Card 2: Today's Bookings */}
          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-zinc-200/80 shadow-sm flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-zinc-500 block truncate">
                Today&apos;s Visits
              </span>
              <span className="text-xl sm:text-3xl font-serif font-bold text-[#ab7f37] mt-1 block">
                {stats.todayCount}
              </span>
              <span className="text-[10px] sm:text-[11px] text-zinc-400 mt-0.5 block truncate">
                {formatDatePretty(todayStr)}
              </span>
            </div>
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#c59c47]/15 text-[#9e7529] flex items-center justify-center shrink-0 ml-2">
              <Clock className="w-4 h-4 sm:w-6 sm:h-6 stroke-[1.8]" />
            </div>
          </div>

          {/* Card 3: Pending Approval */}
          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-zinc-200/80 shadow-sm flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-zinc-500 block truncate">
                Pending Actions
              </span>
              <span className="text-xl sm:text-3xl font-serif font-bold text-amber-600 mt-1 block">
                {stats.pendingCount}
              </span>
              <span className="text-[10px] sm:text-[11px] text-zinc-400 mt-0.5 block truncate">
                Awaiting confirm
              </span>
            </div>
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 ml-2">
              <AlertCircle className="w-4 h-4 sm:w-6 sm:h-6 stroke-[1.8]" />
            </div>
          </div>

          {/* Card 4: Completed Revenue */}
          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-zinc-200/80 shadow-sm flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-zinc-500 block truncate">
                Settled Revenue
              </span>
              <span className="text-xl sm:text-3xl font-serif font-bold text-emerald-700 mt-1 block truncate">
                {formatINR(stats.completedRevenue)}
              </span>
              <span className="text-[10px] sm:text-[11px] text-zinc-400 mt-0.5 block truncate">
                From completed
              </span>
            </div>
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 ml-2">
              <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 stroke-[1.8]" />
            </div>
          </div>
        </div>

        {/* Tab Selector: Bookings vs Services */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 border-b border-zinc-200 pb-2">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              activeTab === "bookings"
                ? "bg-zinc-900 text-white shadow-md"
                : "bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200 sm:border-transparent"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Bookings & Appointments ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("services")}
            className={`w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              activeTab === "services"
                ? "bg-zinc-900 text-white shadow-md"
                : "bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200 sm:border-transparent"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Salon Menu Manager ({services.length})</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: BOOKINGS MANAGEMENT TABLE */}
        {/* ========================================================================= */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/80 shadow-sm overflow-hidden space-y-4 p-4 sm:p-6">
            {/* Filter controls row */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
              {/* Search */}
              <div className="relative flex-1 w-full lg:max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search customer, phone, ID, or service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-2 text-xs rounded-xl border border-zinc-300 bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#c59c47]"
                />
              </div>

              {/* Status and Date Filters */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 text-xs">
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 rounded-xl border border-zinc-300 bg-white text-zinc-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#c59c47]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                {/* Date quick filter */}
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as any)}
                  className="w-full sm:w-auto px-3 py-2 rounded-xl border border-zinc-300 bg-white text-zinc-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#c59c47]"
                >
                  <option value="All">All Dates</option>
                  <option value="Today">Today Only</option>
                  <option value="Custom">Custom Date</option>
                </select>

                {dateFilter === "Custom" && (
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="col-span-2 sm:col-span-1 px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white text-zinc-700"
                  />
                )}

                {/* Sort Order */}
                <button
                  onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
                  className="col-span-2 sm:col-span-1 px-3 py-2 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-700 font-medium flex items-center justify-center gap-1.5"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{sortOrder === "newest" ? "Newest First" : "Oldest First"}</span>
                </button>
              </div>
            </div>

            {/* Empty state */}
            {filteredBookings.length === 0 && (
              <div className="text-center py-12 px-4 text-zinc-400 border border-dashed border-zinc-200 rounded-2xl bg-[#FAF8F5]/40">
                <Calendar className="w-9 h-9 mx-auto mb-2.5 text-[#c59c47]/60" />
                <p className="font-serif font-bold text-zinc-800 text-sm">
                  {bookings.length === 0 ? "All Mock Data Erased" : "No Appointments Found"}
                </p>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                  {bookings.length === 0
                    ? "Your atelier dashboard is clean and ready. Any real customer booking placed on the website will instantly arrive here in real-time."
                    : "Try adjusting your filters, search keywords, or selected status."}
                </p>
              </div>
            )}

            {/* 1. MOBILE RESPONSIVE CARDS VIEW (VISIBLE ON PHONES < 768px) */}
            <div className="block md:hidden space-y-3">
              {filteredBookings.map((b) => {
                const isToday = b.date === todayStr;
                return (
                  <div
                    key={b.id}
                    className={`p-4 rounded-2xl border transition-all space-y-3 ${
                      isToday
                        ? "bg-[#FAF5EB]/60 border-[#c59c47]/50 shadow-sm"
                        : "bg-white border-zinc-200 shadow-sm"
                    }`}
                  >
                    {/* Header Row: ID, Today pill, and Status select */}
                    <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-zinc-100">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-zinc-900 text-xs">
                          {b.id}
                        </span>
                        {isToday && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-100 text-amber-800">
                            Today
                          </span>
                        )}
                      </div>

                      <select
                        value={b.status}
                        onChange={(e) =>
                          handleStatusChange(b.id, e.target.value as BookingStatus)
                        }
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border focus:outline-none cursor-pointer ${
                          b.status === "Confirmed"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : b.status === "Completed"
                            ? "bg-blue-50 text-blue-800 border-blue-300"
                            : b.status === "Pending"
                            ? "bg-amber-50 text-amber-800 border-amber-300"
                            : "bg-rose-50 text-rose-800 border-rose-300"
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    {/* Customer info */}
                    <div className="flex items-start justify-between gap-2 text-xs">
                      <div>
                        <strong className="text-zinc-900 block font-serif text-sm">
                          {b.customerName}
                        </strong>
                        <a
                          href={`tel:${b.customerPhone}`}
                          className="text-[#ab7f37] hover:underline inline-flex items-center gap-1 mt-0.5 font-medium"
                        >
                          <Phone className="w-3 h-3" />
                          <span>+91 {b.customerPhone}</span>
                        </a>
                      </div>

                      <div className="text-right">
                        <span className="font-serif font-bold text-zinc-900 text-base block text-[#ab7f37]">
                          {formatINR(b.totalPrice)}
                        </span>
                        <span className="text-[10px] text-zinc-400">Total Bill</span>
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-between text-xs text-zinc-700">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        <strong>{formatDatePretty(b.date)}</strong>
                      </span>
                      <span className="flex items-center gap-1 text-[#ab7f37] font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        {b.time}
                      </span>
                    </div>

                    {/* Services list */}
                    <div className="flex flex-wrap gap-1 text-[11px]">
                      {b.servicesSummary.map((s) => (
                        <span
                          key={s.id}
                          className="px-2 py-0.5 rounded-lg bg-zinc-100 text-zinc-700 text-[10px] font-medium"
                        >
                          {s.name} ({formatDuration(s.duration)})
                        </span>
                      ))}
                    </div>

                    {/* Actions row */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 text-zinc-700 hover:bg-zinc-200 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>

                      <button
                        onClick={() => setShowDeleteConfirmId(b.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                        title="Delete booking"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 2. DESKTOP TABLE VIEW (VISIBLE ON SCREENS >= 768px) */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-zinc-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] text-zinc-600 font-semibold uppercase tracking-wider border-b border-zinc-200">
                  <tr>
                    <th className="py-3 px-4">Booking ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Treatments Booked</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {filteredBookings.map((b) => {
                    const isToday = b.date === todayStr;
                    return (
                      <tr
                        key={b.id}
                        className={`hover:bg-[#FAF8F5] transition-colors ${
                          isToday ? "bg-[#FAF5EB]/40" : ""
                        }`}
                      >
                        {/* Booking ID */}
                        <td className="py-3.5 px-4 font-mono font-bold text-zinc-900">
                          <span className="flex items-center gap-1">
                            {b.id}
                            {isToday && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-100 text-amber-800">
                                Today
                              </span>
                            )}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="py-3.5 px-4">
                          <strong className="text-zinc-900 block font-medium">
                            {b.customerName}
                          </strong>
                          <a
                            href={`tel:${b.customerPhone}`}
                            className="text-zinc-500 hover:text-[#ab7f37] inline-flex items-center gap-1 mt-0.5"
                          >
                            <Phone className="w-3 h-3 text-zinc-400" />
                            <span>+91 {b.customerPhone}</span>
                          </a>
                        </td>

                        {/* Treatments */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="space-y-1">
                            {b.servicesSummary.map((s) => (
                              <span
                                key={s.id}
                                className="inline-block px-2 py-0.5 mr-1 mb-1 rounded bg-zinc-100 text-zinc-700 text-[11px]"
                              >
                                {s.name} ({formatDuration(s.duration)})
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Date & Time */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <strong className="text-zinc-900 block">
                            {formatDatePretty(b.date)}
                          </strong>
                          <span className="text-zinc-500 font-medium flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-[#ab7f37]" />
                            {b.time}
                          </span>
                        </td>

                        {/* Total Price */}
                        <td className="py-3.5 px-4 whitespace-nowrap font-serif font-bold text-zinc-900 text-sm">
                          {formatINR(b.totalPrice)}
                        </td>

                        {/* Status Dropdown */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <select
                            value={b.status}
                            onChange={(e) =>
                              handleStatusChange(b.id, e.target.value as BookingStatus)
                            }
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border focus:outline-none cursor-pointer ${
                              b.status === "Confirmed"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                : b.status === "Completed"
                                ? "bg-blue-50 text-blue-800 border-blue-300"
                                : b.status === "Pending"
                                ? "bg-amber-50 text-amber-800 border-amber-300"
                                : "bg-rose-50 text-rose-800 border-rose-300"
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedBooking(b)}
                              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                              title="View appointment details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setShowDeleteConfirmId(b.id)}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete appointment"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}


        {/* ========================================================================= */}
        {/* TAB 2: SERVICES MENU MANAGER */}
        {/* ========================================================================= */}
        {activeTab === "services" && (
          <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
              <div>
                <h3 className="font-serif text-xl font-bold text-zinc-900">
                  Salon Catalog & Services
                </h3>
                <p className="text-zinc-500 text-xs mt-0.5">
                  Add, edit, or toggle services. Modifications reflect immediately across the public website and booking flows.
                </p>
              </div>

              <button
                onClick={openCreateModal}
                className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-zinc-900 hover:bg-[#ab7f37] text-white transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Service</span>
              </button>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    srv.isActive
                      ? "bg-white border-zinc-200 shadow-sm"
                      : "bg-zinc-50 border-zinc-200 opacity-60"
                  }`}
                >
                  <div>
                    <div className="relative h-40 w-full rounded-xl overflow-hidden mb-3 bg-zinc-100">
                      <Image
                        src={srv.image}
                        alt={srv.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="object-cover"
                      />
                      <div className="absolute top-2 left-2 flex gap-1">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/90 text-zinc-800">
                          {srv.category}
                        </span>
                        {srv.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#c59c47] text-white">
                            {srv.badge}
                          </span>
                        )}
                      </div>

                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            srv.isActive
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-zinc-200 text-zinc-600"
                          }`}
                        >
                          {srv.isActive ? "Active" : "Hidden"}
                        </span>
                      </div>
                    </div>

                    <h4 className="font-serif font-bold text-zinc-900 text-base">{srv.name}</h4>
                    <p className="text-zinc-500 text-xs line-clamp-2 mt-1 leading-snug">
                      {srv.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-zinc-400 block text-[10px]">
                        {formatDuration(srv.duration)}
                      </span>
                      <strong className="text-zinc-900 text-sm font-serif">
                        {formatINR(srv.price)}
                      </strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleServiceActive(srv.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          srv.isActive
                            ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                            : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        }`}
                      >
                        {srv.isActive ? "Hide" : "Show"}
                      </button>

                      <button
                        onClick={() => openEditModal(srv)}
                        className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                        title="Edit service"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteService(srv.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                        title="Delete service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: BOOKING DETAIL VIEW */}
      {/* ========================================================================= */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Appointment Dossier
                </span>
                <h3 className="font-serif text-xl font-bold text-zinc-900">
                  Booking #{selectedBooking.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Guest Summary */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-zinc-200 space-y-2 text-xs">
              <strong className="text-zinc-900 block font-semibold uppercase tracking-wider text-[10px]">
                Guest Contact
              </strong>
              <div className="grid grid-cols-2 gap-2 text-zinc-700">
                <p>
                  <strong>Name:</strong> {selectedBooking.customerName}
                </p>
                <p>
                  <strong>Phone:</strong> +91 {selectedBooking.customerPhone}
                </p>
                {selectedBooking.customerEmail && (
                  <p className="col-span-2">
                    <strong>Email:</strong> {selectedBooking.customerEmail}
                  </p>
                )}
                {selectedBooking.customerNotes && (
                  <p className="col-span-2 text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200/60">
                    <strong>Guest Notes:</strong> {selectedBooking.customerNotes}
                  </p>
                )}
              </div>
            </div>

            {/* Schedule & Status */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-zinc-200">
                <span className="text-zinc-400 block text-[10px] uppercase font-semibold">Date</span>
                <strong className="text-zinc-900 text-sm">
                  {formatDatePretty(selectedBooking.date)}
                </strong>
              </div>
              <div className="p-3 rounded-xl border border-zinc-200">
                <span className="text-zinc-400 block text-[10px] uppercase font-semibold">Time Slot</span>
                <strong className="text-zinc-900 text-sm">{selectedBooking.time}</strong>
              </div>
            </div>

            {/* Services breakdown */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Treatments ({selectedBooking.servicesSummary.length})
              </span>
              <div className="divide-y divide-zinc-100 border border-zinc-200 rounded-xl overflow-hidden">
                {selectedBooking.servicesSummary.map((s) => (
                  <div key={s.id} className="p-3 flex justify-between items-center text-xs">
                    <div>
                      <strong className="text-zinc-900 block">{s.name}</strong>
                      <span className="text-zinc-400 text-[11px]">
                        {s.category} • {formatDuration(s.duration)}
                      </span>
                    </div>
                    <span className="font-serif font-bold text-zinc-900">{formatINR(s.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Total */}
            <div className="pt-2 flex justify-between items-center text-sm font-semibold border-t border-zinc-200">
              <span className="text-zinc-600">Total Payable at Salon</span>
              <span className="font-serif text-xl font-bold text-[#ab7f37]">
                {formatINR(selectedBooking.totalPrice)}
              </span>
            </div>

            {/* Quick Status Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
              <span className="text-xs text-zinc-500">Update Status:</span>
              <div className="flex gap-1.5">
                {(["Pending", "Confirmed", "Completed", "Cancelled"] as BookingStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedBooking.id, st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      selectedBooking.status === st
                        ? "bg-zinc-900 text-white"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: DELETE CONFIRMATION */}
      {/* ========================================================================= */}
      {showDeleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-zinc-900">Delete Appointment?</h3>
            <p className="text-xs text-zinc-500">
              This will permanently remove booking #{showDeleteConfirmId} from your records and free up the reserved time slot.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold border border-zinc-200 text-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteBooking(showDeleteConfirmId)}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: RESET DEMO DATA CONFIRMATION */}
      {/* ========================================================================= */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-zinc-900">Erase Mock Data?</h3>
            <p className="text-xs text-zinc-500">
              This will erase all mock and demo bookings so you have a completely fresh slate for real customer appointments. Default salon services will be preserved.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold border border-zinc-200 text-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={handleResetData}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-amber-600 text-white hover:bg-amber-700"
              >
                Erase Mock Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: ADD / EDIT SERVICE */}
      {/* ========================================================================= */}
      {(editingService || isCreatingService) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <h3 className="font-serif text-xl font-bold text-zinc-900">
                {editingService ? "Edit Treatment" : "Add New Salon Treatment"}
              </h3>
              <button
                onClick={() => {
                  setEditingService(null);
                  setIsCreatingService(false);
                }}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-zinc-700 uppercase">Treatment Name *</label>
                <input
                  type="text"
                  required
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  placeholder="e.g. 24K Gold Illuminating Facial"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-sm focus:ring-1 focus:ring-[#c59c47]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 uppercase">Category *</label>
                  <select
                    value={serviceForm.category}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        category: e.target.value as ServiceCategory,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-sm bg-white"
                  >
                    <option value="Hair">Hair</option>
                    <option value="Skin">Skin</option>
                    <option value="Nails">Nails</option>
                    <option value="Bridal & Makeup">Bridal & Makeup</option>
                    <option value="Grooming">Grooming</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 uppercase">Badge (Optional)</label>
                  <input
                    type="text"
                    value={serviceForm.badge}
                    onChange={(e) => setServiceForm({ ...serviceForm, badge: e.target.value })}
                    placeholder="e.g. Signature, Luxury"
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 uppercase">Duration (Minutes) *</label>
                  <input
                    type="number"
                    min={15}
                    step={5}
                    required
                    value={serviceForm.duration}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, duration: parseInt(e.target.value, 10) || 30 })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 uppercase">Price (₹) *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={serviceForm.price}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, price: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-700 uppercase">Unsplash Image URL *</label>
                <input
                  type="url"
                  required
                  value={serviceForm.image}
                  onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-700 uppercase">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  placeholder="Describe treatment benefits and steps..."
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-sm"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={serviceForm.isActive}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, isActive: e.target.checked })
                    }
                    className="rounded text-[#c59c47] focus:ring-[#c59c47]"
                  />
                  <span className="font-semibold text-zinc-700">Active (Visible to public)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={serviceForm.featured}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, featured: e.target.checked })
                    }
                    className="rounded text-[#c59c47] focus:ring-[#c59c47]"
                  />
                  <span className="font-semibold text-zinc-700">Featured on Home</span>
                </label>
              </div>

              <div className="flex gap-2 pt-4 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => {
                    setEditingService(null);
                    setIsCreatingService(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-zinc-900 hover:bg-[#ab7f37] text-white font-bold uppercase tracking-wider"
                >
                  Save Treatment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
