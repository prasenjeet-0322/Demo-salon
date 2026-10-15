import { Booking, BookingStatus, Service } from "@/types";
import { DEFAULT_SERVICES } from "@/data/services";

const SERVICES_KEY = "demo_salon_services";
const BOOKINGS_KEY = "demo_salon_bookings";
const AUTH_KEY = "demo_salon_admin_auth";
const SYNC_EVENT_NAME = "salon-storage-sync";

// Helper to safely dispatch sync event in browser
function notifySync(key: string) {
  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME, { detail: { key } }));
    } catch {
      // Ignore if event dispatch fails in SSR/edge
    }
  }
}

// ----------------------------------------------------------------------
// Storage API wrapper
// ----------------------------------------------------------------------
export const storage = {
  // SERVICES
  getServices(): Service[] {
    if (typeof window === "undefined") {
      return DEFAULT_SERVICES;
    }
    try {
      const stored = localStorage.getItem(SERVICES_KEY);
      if (!stored) {
        localStorage.setItem(SERVICES_KEY, JSON.stringify(DEFAULT_SERVICES));
        return DEFAULT_SERVICES;
      }
      return JSON.parse(stored) as Service[];
    } catch {
      return DEFAULT_SERVICES;
    }
  },

  saveServices(services: Service[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
      notifySync(SERVICES_KEY);
    } catch (e) {
      console.error("Failed to save services to localStorage", e);
    }
  },

  addService(serviceData: Omit<Service, "id">): Service {
    const services = this.getServices();
    const id = "srv-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 5);
    const newService: Service = {
      ...serviceData,
      id,
    };
    services.unshift(newService);
    this.saveServices(services);
    return newService;
  },

  updateService(updatedService: Service): void {
    const services = this.getServices();
    const index = services.findIndex((s) => s.id === updatedService.id);
    if (index !== -1) {
      services[index] = updatedService;
      this.saveServices(services);
    }
  },

  deleteService(id: string): void {
    const services = this.getServices().filter((s) => s.id !== id);
    this.saveServices(services);
  },

  toggleServiceActive(id: string): void {
    const services = this.getServices().map((s) =>
      s.id === id ? { ...s, isActive: !s.isActive } : s
    );
    this.saveServices(services);
  },

  // BOOKINGS (Clean start with real data only)
  getBookings(): Booking[] {
    if (typeof window === "undefined") {
      return [];
    }
    try {
      // Automatic one-time wipe of old mock demo entries for the user
      const hasWiped = localStorage.getItem("demo_salon_mock_wiped_v3");
      if (hasWiped !== "true") {
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify([]));
        localStorage.setItem("demo_salon_mock_wiped_v3", "true");
        notifySync(BOOKINGS_KEY);
        return [];
      }

      const stored = localStorage.getItem(BOOKINGS_KEY);
      if (!stored) {
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify([]));
        return [];
      }
      const parsed = JSON.parse(stored) as Booking[];
      // Filter out any leftover mock initial demo entries if requested
      const mockNames = ["Ananya Sharma", "Rohan Kapoor", "Priyanka Verma", "Meera Sen", "Kavita Singhania"];
      const cleaned = parsed.filter(b => !mockNames.includes(b.customerName));
      if (cleaned.length !== parsed.length) {
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(cleaned));
        return cleaned;
      }
      return parsed;
    } catch {
      return [];
    }
  },

  saveBookings(bookings: Booking[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
      notifySync(BOOKINGS_KEY);
    } catch (e) {
      console.error("Failed to save bookings to localStorage", e);
    }
  },

  clearAllBookings(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify([]));
    localStorage.setItem("demo_salon_mock_wiped_v3", "true");
    notifySync(BOOKINGS_KEY);
  },

  // Check if slot is already occupied on a given date (ignores Cancelled bookings)
  isSlotBooked(date: string, time: string, excludeBookingId?: string): boolean {
    const bookings = this.getBookings();
    return bookings.some(
      (b) =>
        b.date === date &&
        b.time.toLowerCase() === time.toLowerCase() &&
        b.status !== "Cancelled" &&
        (!excludeBookingId || b.id !== excludeBookingId)
    );
  },

  getBookedSlots(date: string): string[] {
    const bookings = this.getBookings();
    return bookings
      .filter((b) => b.date === date && b.status !== "Cancelled")
      .map((b) => b.time);
  },

  addBooking(bookingInput: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    customerNotes?: string;
    serviceIds: string[];
    date: string;
    time: string;
  }): { success: boolean; booking?: Booking; error?: string } {
    // 1. Prevent double booking
    if (this.isSlotBooked(bookingInput.date, bookingInput.time)) {
      return {
        success: false,
        error: `The ${bookingInput.time} slot on ${bookingInput.date} has already been reserved. Please select another time slot.`,
      };
    }

    const allServices = this.getServices();
    const selectedServices = allServices.filter((s) =>
      bookingInput.serviceIds.includes(s.id)
    );

    if (selectedServices.length === 0) {
      return {
        success: false,
        error: "Please select at least one service.",
      };
    }

    const servicesSummary = selectedServices.map((s) => ({
      id: s.id,
      name: s.name,
      price: s.price,
      duration: s.duration,
      category: s.category,
    }));

    const totalPrice = servicesSummary.reduce((acc, curr) => acc + curr.price, 0);
    const totalDuration = servicesSummary.reduce((acc, curr) => acc + curr.duration, 0);

    const bookingId = "DEMO-" + Math.floor(1000 + Math.random() * 9000);

    const newBooking: Booking = {
      id: bookingId,
      customerName: bookingInput.customerName.trim(),
      customerPhone: bookingInput.customerPhone.trim(),
      customerEmail: bookingInput.customerEmail?.trim() || undefined,
      customerNotes: bookingInput.customerNotes?.trim() || undefined,
      serviceIds: bookingInput.serviceIds,
      servicesSummary,
      totalPrice,
      totalDuration,
      date: bookingInput.date,
      time: bookingInput.time,
      status: "Confirmed",
      createdAt: new Date().toISOString(),
    };

    const bookings = this.getBookings();
    bookings.unshift(newBooking);
    this.saveBookings(bookings);

    return {
      success: true,
      booking: newBooking,
    };
  },

  updateBookingStatus(id: string, status: BookingStatus): void {
    const bookings = this.getBookings().map((b) =>
      b.id === id ? { ...b, status, updatedAt: new Date().toISOString() } : b
    );
    this.saveBookings(bookings);
  },

  deleteBooking(id: string): void {
    const bookings = this.getBookings().filter((b) => b.id !== id);
    this.saveBookings(bookings);
  },

  resetDemoData(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(SERVICES_KEY, JSON.stringify(DEFAULT_SERVICES));
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify([]));
    localStorage.setItem("demo_salon_mock_wiped_v3", "true");
    notifySync(SERVICES_KEY);
    notifySync(BOOKINGS_KEY);
  },

  // ADMIN AUTH
  getAdminAuth(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(AUTH_KEY) === "true";
  },

  setAdminAuth(isAuth: boolean): void {
    if (typeof window === "undefined") return;
    if (isAuth) {
      localStorage.setItem(AUTH_KEY, "true");
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
    notifySync(AUTH_KEY);
  },

  // REALTIME / SYNC LISTENER
  subscribe(callback: (key?: string) => void): () => void {
    if (typeof window === "undefined") return () => {};

    const handleStorageEvent = (e: StorageEvent) => {
      if (
        e.key === SERVICES_KEY ||
        e.key === BOOKINGS_KEY ||
        e.key === AUTH_KEY ||
        e.key === null
      ) {
        callback(e.key || undefined);
      }
    };

    const handleCustomSync = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      callback(detail?.key);
    };

    window.addEventListener("storage", handleStorageEvent);
    window.addEventListener(SYNC_EVENT_NAME, handleCustomSync);

    return () => {
      window.removeEventListener("storage", handleStorageEvent);
      window.removeEventListener(SYNC_EVENT_NAME, handleCustomSync);
    };
  },
};
