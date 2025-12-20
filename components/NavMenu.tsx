import React, { useState, useRef, useEffect } from "react";

const menuOptions = [
  { label: "Volvox Kickstart", href: "#" },
  { label: "Innoscope", href: "#" },
  { label: "SmartSearch", href: "#" },
];

export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md border border-gray-200 hover:bg-blue-50 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        title="Open navigation menu"
      >
        {/* Hamburger icon SVG */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="5"
            y="8"
            width="18"
            height="2.5"
            rx="1.25"
            fill="currentColor"
          />
          <rect
            x="5"
            y="13"
            width="18"
            height="2.5"
            rx="1.25"
            fill="currentColor"
          />
          <rect
            x="5"
            y="18"
            width="18"
            height="2.5"
            rx="1.25"
            fill="currentColor"
          />
        </svg>
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-end bg-black/40 animate-menu-fade"
          style={{ backdropFilter: "blur(2px)" }}
        >
          {/* Slide-in panel from top right */}
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-white shadow-2xl animate-slide-in-top-right">
            <button
              className="absolute top-6 right-8 text-3xl text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              &times;
            </button>
            <div className="flex flex-col items-center justify-center w-full h-full gap-10">
              {menuOptions.map((option) => (
                <a
                  key={option.label}
                  href={option.href}
                  className="text-3xl md:text-5xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-150 py-4 px-8 rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  onClick={() => setOpen(false)}
                >
                  {option.label}
                </a>
              ))}
            </div>
          </div>
          <style jsx>{`
            @keyframes menu-fade {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            .animate-menu-fade {
              animation: menu-fade 0.2s ease;
            }
            @keyframes slide-in-top-right {
              from {
                opacity: 0;
                transform: translateY(-40px) translateX(40px) scale(0.98);
              }
              to {
                opacity: 1;
                transform: translateY(0) translateX(0) scale(1);
              }
            }
            .animate-slide-in-top-right {
              animation: slide-in-top-right 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            }
          `}</style>
        </div>
      )}
      {/* Only one <style jsx> block for overlay animations, already included in overlay rendering above */}
    </div>
  );
}
