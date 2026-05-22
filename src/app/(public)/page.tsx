"use client";

import { useUIStore } from "@/store/ui.store";

export default function HomePage() {
  const toggleMobileMenu = useUIStore(
    (state) => state.toggleMobileMenu
  );

  const mobileMenuOpen = useUIStore(
    (state) => state.mobileMenuOpen
  );

  return (
    <main className="p-10">
      <button
        onClick={toggleMobileMenu}
        className="rounded-lg bg-black px-6 py-3 text-white"
      >
        Toggle Menu
      </button>

      <p className="mt-4">
        Mobile menu:
        {" "}
        {mobileMenuOpen ? "OPEN" : "CLOSED"}
      </p>
    </main>
  );
}