import React from "react";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/router";

const navLinks = [
  { label: "Volvox", key: "volvox", selected: true },
  { label: "Kick Start", key: "kickstart" },
  { label: "Innoscope", key: "innoscope" },
  { label: "Smart Search", key: "smart_search" },
];

function getAuthSessionData() {
  let token = "";
  let userName = "";
  let userEmail = "";
  let userId = "";
  try {
    const authStorage = sessionStorage.getItem("auth-storage");
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      token = parsed.state?.token || "";
      userName = parsed.state?.user?.name || "";
      userEmail = parsed.state?.user?.email || "";
      userId = parsed.state?.user?.id || "";
    }
  } catch (e) {
    // fallback to empty values
  }
  return { token, userName, userEmail, userId };
}

const openUrl = (key: string) => {
  let baseUrlEnv = "";
  if (key === "innoscope") {
    baseUrlEnv = process.env.NEXT_PUBLIC_INNOSCOPE_API_KEY || "";
  } else if (key === "smart_search") {
    baseUrlEnv = process.env.NEXT_PUBLIC_AETHER_API_KEY || "";
  } else if (key === "kickstart") {
    baseUrlEnv = process.env.NEXT_PUBLIC_KICKSTART_API_KEY || "";
  }

  // Use the helper function to get session data
  const { token, userName, userEmail, userId } = getAuthSessionData();

  if (!baseUrlEnv) return;
  const url = new URL(baseUrlEnv);
  url.searchParams.set("token", token);
  url.searchParams.set("user_name", userName);
  url.searchParams.set("user_email", userEmail);
  url.searchParams.set("user_id", userId);
  window.open(url.toString(), "_blank");
};

export default function DashboardNavbar() {
  function handleGetStarted() {
    const LOGOUT_URL = process.env.NEXT_PUBLIC_LOGOUT_URL + "/workflows" || "";
    window.location.href = LOGOUT_URL;
  }

  function handleBackToDashboard() {
    const DASHBOARD_URL = process.env.NEXT_PUBLIC_LOGOUT_URL || "";
    window.location.href = DASHBOARD_URL;
  }
  return (
    <header className="border-b border-zinc-800/50 backdrop-blur-sm sticky top-0 z-50 bg-white/80 dark:bg-transparent transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg blur-md opacity-75"></div>
            <div className="relative bg-black dark:bg-black px-3 py-2 rounded-lg border border-purple-500/50">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <h1 className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            idealForge AI
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => openUrl(link.key)}
              className={`transition-colors px-4 py-2 rounded-lg font-medium ${
                link.selected
                  ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-extrabold shadow-xl border-2 border-purple-500/80 scale-105 ring-2 ring-purple-400/40 dark:ring-purple-400/60 drop-shadow-lg outline outline-white dark:outline-black"
                  : "text-zinc-700 dark:text-zinc-400 hover:text-white dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
              style={
                link.selected
                  ? {
                      color: "#fff",
                      textShadow: "0 2px 8px rgba(0,0,0,0.25), 0 0 2px #fff",
                      letterSpacing: "0.03em",
                    }
                  : {}
              }
            >
              {link.label}
            </button>
          ))}
          {/* Get Started and Logout buttons */}
          <button
            onClick={handleGetStarted}
            className="px-5 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-purple-500 to-cyan-500 shadow-lg transition-all hover:scale-105"
          >
            Get Started
          </button>
          <button
            onClick={handleBackToDashboard}
            className="px-5 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 shadow-lg transition-all hover:scale-105"
          >
            Back
          </button>
        </div>
      </div>
    </header>
  );
}
